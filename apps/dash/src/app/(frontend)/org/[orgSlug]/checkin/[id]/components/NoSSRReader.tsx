import dynamic from "next/dynamic";
import { LoadingSpinner } from "odinkit";

export const NoSsrReader = dynamic(() => import("./Reader"), {
    loading: () => (
        <div className="flex h-full w-full items-center justify-center">
            <div className="flex flex-col justify-center items-center gap-2 py-4">
                <LoadingSpinner />
                Carregando Câmera
            </div>
        </div>
    ),
    ssr: false,
});
