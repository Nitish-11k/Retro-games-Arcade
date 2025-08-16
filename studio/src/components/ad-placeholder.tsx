import { Megaphone } from "lucide-react";

const AdPlaceholder = () => {
    return (
        <div className="w-full bg-card border-2 border-dashed border-border rounded-md p-4 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
                <Megaphone className="mx-auto h-8 w-8 mb-2" />
                <p className="font-body text-sm">Future Ad Banner</p>
            </div>
        </div>
    );
};

export default AdPlaceholder;
