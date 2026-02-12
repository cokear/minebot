import os
import subprocess

def run_cmd(cmd):
    print(f"Executing: {cmd}")
    res = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if res.returncode != 0:
        print(f"Error: {res.stderr}")
    else:
        print(res.stdout)
    return res.returncode

run_cmd("git add .")
run_cmd('git commit -m "fix: v16 precision alignment (Host fallback, conditional early data, record_fragment)"')
run_cmd("git push origin main")
