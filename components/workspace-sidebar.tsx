import { Upload, FileText } from "lucide-react";

type WorkspaceSidebarProps = {
  files: string[];
  selectedFile: string;
  setSelectedFile: (file: string) => void;
};

export default function WorkspaceSidebar({
  files,
  selectedFile,
  setSelectedFile,
}: WorkspaceSidebarProps) {
  return (
    <div className="w-full md:w-1/5 border-b md:border-b-0 md:border-r border-white/10 bg-white/5 p-4 flex flex-col gap-4">

      <h2 className="text-base md:text-lg font-bold flex items-center gap-2">
        <Upload size={18} />
        Workspace
      </h2>

      <button className="h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 hover:bg-purple-600/30 transition text-sm">
        + Upload PDF
      </button>

      <div className="flex md:block gap-2 overflow-x-auto md:overflow-visible">

        {files.map((f) => (
          <button
            key={f}
            onClick={() => setSelectedFile(f)}
            className={`min-w-[180px] md:w-full text-left p-3 rounded-2xl border flex items-center gap-2 transition ${
              selectedFile === f
                ? "bg-purple-600/20 border-purple-500"
                : "bg-white/5 border-white/10 hover:bg-white/10"
            }`}
          >

            <FileText
              size={16}
              className="text-purple-400"
            />

            <span className="text-sm truncate">
              {f}
            </span>

          </button>
        ))}

      </div>

    </div>
  );
}