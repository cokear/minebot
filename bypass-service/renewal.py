from seleniumbase import SB
import time
import os
import json
import base64
from pathlib import Path
from datetime import datetime

class RenewalHandler:
    def __init__(self, output_dir="output"):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.screenshot_dir = self.output_dir / "screenshots"
        self.screenshot_dir.mkdir(parents=True, exist_ok=True)

    def run_renewal(self, url, username, password, proxy=None, selectors=None, timeout=120):
        result = {
            "success": False,
            "message": "初始化...",
            "screenshot_url": None,
            "logs": [],
            "timestamp": datetime.now().isoformat()
        }
        
        selectors = selectors or {}
        
        def log(msg, type="info"):
            entry = f"[{datetime.now().strftime('%H:%M:%S')}] {msg}"
            print(entry)
            result["logs"].append({"time": datetime.now().isoformat(), "type": type, "message": msg})

        log(f"开始续期流程: {url}")
        
        try:
            # UC Mode 启动浏览器
            with SB(uc=True, test=True, locale="en", proxy=proxy, incognito=True) as sb:
                log("浏览器启动成功 (UC Mode)")
                
                # 1. 访问登录页 (自适应逻辑: 先访问目标页，如果跳转到登录页则处理)
                log(f"访问页面: {url}")
                sb.uc_open_with_reconnect(url, reconnect_time=6.0)
                
                # 处理 Cloudflare
                self._handle_cloudflare(sb, log)
                
                # 等待页面加载
                time.sleep(3)
                
                # 检查是否需要登录
                current_url = sb.get_current_url()
                log(f"当前页面: {current_url}")
                
                if self._check_is_login_page(sb, current_url):
                    log("检测到登录页面，开始登录流程...")
                    self._handle_login(sb, username, password, log)
                    
                    # 登录后再次处理可能的验证
                    self._handle_cloudflare(sb, log)
                    
                    # 再次检查是否在目标页面
                    current_url = sb.get_current_url()
                    if self._check_is_login_page(sb, current_url):
                         # 尝试再次跳转
                         log("登录后似乎未跳转，尝试重新访问目标URL...")
                         sb.uc_open_with_reconnect(url, reconnect_time=3.0)
                         time.sleep(3)

                # 2. 查找并点击续期按钮
                log("查找续期按钮...")
                
                # 优先使用自定义选择器
                clicked = False
                if selectors.get("renew_btn"):
                    if sb.is_element_visible(selectors["renew_btn"]):
                        log(f"发现自定义按钮: {selectors['renew_btn']}")
                        sb.click(selectors["renew_btn"])
                        clicked = True
                
                if not clicked:
                    # 智能查找
                    renew_keywords = ["Renew", "renew", "Extend", "extend", "续期", "续订"]
                    
                    # 尝试通过链接文本
                    for kw in renew_keywords:
                        if sb.is_link_text_visible(kw):
                            log(f"通过链接文本找到按钮: {kw}")
                            sb.click_link_text(kw)
                            clicked = True
                            break
                        # 模糊匹配
                        if sb.is_partial_link_text_visible(kw):
                            log(f"通过部分链接文本找到按钮: {kw}")
                            sb.click_partial_link_text(kw)
                            clicked = True
                            break
                            
                if not clicked:
                    # 尝试按钮 CSS 类或 ID
                    btn_candidates = [
                        "button:contains('Renew')", "button:contains('续期')", 
                        ".btn-primary:contains('Renew')", "[class*='renew']",
                        "button[type='submit']"
                    ]
                    # SeleniumBase 选择器需要精确，这里简化处理，使用 JS 查找
                    found_by_js = sb.execute_script("""
                        const keywords = ['Renew', 'renew', 'Extend', 'extend', '续期'];
                        const buttons = Array.from(document.querySelectorAll('button, a, input[type="submit"], [role="button"]'));
                        for (const btn of buttons) {
                            if (keywords.some(kw => (btn.textContent || btn.value || '').includes(kw))) {
                                btn.click();
                                return true;
                            }
                        }
                        return false;
                    """)
                    
                    if found_by_js:
                        log("通过 JS 智能查找并点击了按钮")
                        clicked = True
                
                if clicked:
                    log("已点击续期按钮，等待结果...")
                    time.sleep(5)
                    self._handle_cloudflare(sb, log) # 处理点击后可能的验证
                    
                    # 检查是否有确认弹窗
                    try:
                        if sb.is_element_visible("button:contains('Confirm')"):
                             sb.click("button:contains('Confirm')")
                    except: pass
                    
                    # 验证成功状态
                    time.sleep(2)
                    page_text = sb.get_text("body").lower()
                    success_keywords = ["success", "renewed", "extended", "成功", "已续期"]
                    
                    # 截图
                    screenshot_name = f"success_{datetime.now().strftime('%Y%m%d%H%M%S')}.png"
                    sb.save_screenshot(str(self.screenshot_dir / screenshot_name))
                    result["screenshot_url"] = f"/api/screenshots/{screenshot_name}" # 需要后端映射
                    
                    if any(kw in page_text for kw in success_keywords):
                        result["success"] = True
                        result["message"] = "续期成功"
                        log("续期成功检测通过")
                    else:
                        result["success"] = True # 点击了就算一种成功，只是无法确认结果
                        result["message"] = "已点击续期，但未检测到明确成功提示"
                        log("操作完成(结果不确定)")
                else:
                    log("未找到续期按钮", "error")
                    result["message"] = "找不到续期按钮"
                    # 截图失败现场
                    screenshot_name = f"error_{datetime.now().strftime('%Y%m%d%H%M%S')}.png"
                    sb.save_screenshot(str(self.screenshot_dir / screenshot_name))
                    result["screenshot_url"] = f"/api/screenshots/{screenshot_name}"

        except Exception as e:
            msg = str(e)
            log(f"发生错误: {msg}", "error")
            result["message"] = f"执行出错: {msg}"
            result["success"] = False

        return result

    def _handle_cloudflare(self, sb, log):
        if sb.is_element_visible('iframe[src*="challenge"]', by="css selector") or \
           sb.is_element_visible('#challenge-stage', by="css selector") or \
           "Just a moment" in sb.get_title():
            log("检测到 Cloudflare 验证，尝试处理...")
            try:
                sb.uc_gui_click_captcha()
                time.sleep(4)
            except:
                # 备用点击方案
                sb.click_if_visible('iframe[src*="challenge"]', by="css selector")
                time.sleep(2)

    def _check_is_login_page(self, sb, url):
        url_lower = url.lower()
        if any(x in url_lower for x in ["login", "signin", "auth", "sign-in"]):
            return True
        # 检查页面元素
        if sb.is_element_visible("input[type='password']"):
            return True
        return False
        
    def _handle_login(self, sb, username, password, log):
        log("填写登录表单...")
        
        # 查找用户名
        user_selectors = ["input[name='email']", "input[name='username']", "input[type='email']", "#email", "#username"]
        user_input = None
        for sel in user_selectors:
            if sb.is_element_visible(sel):
                user_input = sel
                break
        
        if user_input:
            sb.type(user_input, username)
            time.sleep(0.5)
        else:
            log("找不到用户名输入框", "error")
            return

        # 查找密码
        pass_selectors = ["input[name='password']", "input[type='password']", "#password"]
        pass_input = None
        for sel in pass_selectors:
            if sb.is_element_visible(sel):
                pass_input = sel
                break
                
        if pass_input:
            sb.type(pass_input, password)
            time.sleep(0.5)
            
            # 提交
            sb.click("button[type='submit']")
            log("点击登录按钮")
            
            # 等待跳转
            time.sleep(5)
        else:
            # 可能是多步登录 (如 Clerk)
            if sb.is_element_visible("button:contains('Continue')") or sb.is_element_visible("button[type='submit']"):
                log("检测到可能的两步登录，尝试点击继续...")
                sb.click("button[type='submit']")
                time.sleep(2)
                
                # 再次查找密码框
                for sel in pass_selectors:
                    if sb.is_element_visible(sel):
                        sb.type(sel, password)
                        sb.click("button[type='submit']")
                        time.sleep(5)
                        break
