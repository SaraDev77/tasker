import type { useToast } from "primevue";

export const showErrToast = (toast: ReturnType<typeof useToast>, msg: string) => {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: msg,
      life: 3000,
    });
  };
  
  export const showSuccessToast = (toast: ReturnType<typeof useToast>, msg: string) => {
    toast.add({
      severity: 'success',
      summary: 'Succeeded!',
      detail: msg,
      life: 3000,
    });
  };

