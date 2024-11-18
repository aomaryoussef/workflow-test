"use client"; // Error boundaries must be Client Components
import WarningTwoTone from "@ant-design/icons/lib/icons/WarningTwoTone";
import { useTypedTranslation } from "@common/hooks/useTypedTranslation.ts";

export default function GlobalError({reset}: Readonly<{ error: Error & { digest?: string }; reset: () => void }>) {
    const t = useTypedTranslation('common');

    return (
        // global-error must include html and body tags
        <html>
        <body className='h-screen w-full flex flex-col items-center justify-center bg-white gap-y-3'>
        <WarningTwoTone className='text-6xl'/>
        <h2 className='text-2xl'>{t('errorMessage')}</h2>
        <button
            className='mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600'
            onClick={() => reset()}
        >
            {t('tryAgain')}
        </button>
        </body>
        </html>
    );
}
