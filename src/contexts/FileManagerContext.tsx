import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import { FileManager } from "@/components/FileManager";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileManagerContextType {
    openFileManager: (serverId: string, serverName: string) => void;
    closeFileManager: () => void;
}

const FileManagerContext = createContext<FileManagerContextType | null>(null);

export function useFileManager() {
    const context = useContext(FileManagerContext);
    if (!context) {
        throw new Error("useFileManager must be used within FileManagerProvider");
    }
    return context;
}

interface FileManagerProviderProps {
    children: ReactNode;
}

export function FileManagerProvider({ children }: FileManagerProviderProps) {
    const [open, setOpen] = useState(false);
    const [serverId, setServerId] = useState("");
    const [serverName, setServerName] = useState("");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // 禁止背景滚动
    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    const openFileManager = (id: string, name: string) => {
        setServerId(id);
        setServerName(name);
        setOpen(true);
    };

    const closeFileManager = () => {
        setOpen(false);
    };

    // 自定义模态层 - 使用 createPortal 直接渲染到 body
    const modal = open && mounted ? createPortal(
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
        >
            {/* 遮罩层 */}
            <div
                className="absolute inset-0 bg-black/80 animate-in fade-in duration-200"
                onClick={closeFileManager}
            />
            {/* 弹窗内容 */}
            <div
                className="relative w-[95vw] max-w-5xl h-[85vh] bg-background border rounded-xl shadow-2xl animate-in zoom-in-95 fade-in duration-200 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <FileManager
                    serverId={serverId}
                    serverName={serverName}
                    onClose={closeFileManager}
                />
            </div>
        </div>,
        document.body
    ) : null;

    return (
        <FileManagerContext.Provider value={{ openFileManager, closeFileManager }}>
            {children}
            {modal}
        </FileManagerContext.Provider>
    );
}
