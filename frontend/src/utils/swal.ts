type ConfirmOptions = {
    title?: string;
    text?: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
};

async function loadSwal() {
    try {
        const mod = await import('sweetalert2');
        return (mod && (mod as any).default) || mod;
    } catch (err) {
        return null;
    }
}

export async function swalConfirm(opts: ConfirmOptions = {}): Promise<boolean> {
    const Swal = await loadSwal();
    if (Swal) {
        const result = await Swal.fire({
            title: opts.title || 'Are you sure?',
            text: opts.text || '',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: opts.confirmButtonText || 'Yes',
            cancelButtonText: opts.cancelButtonText || 'Cancel',
        });
        return !!result.isConfirmed;
    }

    return confirm(opts.title || 'Are you sure?');
}

export async function swalSuccess(message: string, title?: string) {
    const Swal = await loadSwal();
    if (Swal) {
        await Swal.fire({ icon: 'success', title: title || 'Success', text: message });
        return;
    }
    alert(message);
}

export async function swalError(message: string, title?: string) {
    const Swal = await loadSwal();
    if (Swal) {
        await Swal.fire({ icon: 'error', title: title || 'Error', text: message });
        return;
    }
    alert(message);
}

export async function swalInfo(message: string, title?: string) {
    const Swal = await loadSwal();
    if (Swal) {
        await Swal.fire({ icon: 'info', title: title || 'Info', text: message });
        return;
    }
    alert(message);
}

export default { swalConfirm, swalSuccess, swalError, swalInfo };
