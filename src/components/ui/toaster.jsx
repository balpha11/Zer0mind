// src/components/ui/toaster.jsx
import {
	Toast,
	ToastClose,
	ToastDescription,
	ToastProvider,
	ToastTitle,
	ToastViewport,
} from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';

// List of valid HTML attributes for the <li> element
const validLiProps = [
  'className',
  'style',
  'id',
  'onClick',
  'onMouseEnter',
  'onMouseLeave',
  'onKeyDown',
  'onKeyUp',
  'role',
  'aria-label',
  'aria-labelledby',
  'aria-describedby',
  'aria-hidden',
  // Add other valid HTML attributes as needed
];

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, ...props }) => {
        // Filter out invalid props to prevent warnings
        const filteredProps = Object.fromEntries(
          Object.entries(props).filter(([key]) => validLiProps.includes(key))
        );

        return (
          <Toast key={id} {...filteredProps}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
