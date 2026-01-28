export interface ToastProps {
    id: string
    title?: string
    description?: string
    action?: React.ReactNode
}

export interface Toast extends ToastProps {
    open: boolean
}

export function useToast() {
    return {
        toast: (props: Omit<ToastProps, 'id'>) => {
            console.log('Toast:', props)
        },
        toasts: [] as Toast[]
    }
}

export const toast = (props: Omit<ToastProps, 'id'>) => {
    console.log('Toast:', props)
}
