import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor'

export default function EditingPage() {
  return (
    <div className="w-screen h-screen p-4 overflow-auto ">
      <h1 className="text-2xl font-semibold mb-4">Editing Page</h1>
      <div className="w-full h-full">
        <SimpleEditor />
      </div>
    </div>
  );
}
