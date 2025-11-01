import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor'
import CoverImageUploader from './CoverImageUploader';
import MyCoverImage from './mycoverimage';

export default function EditingPage() {
  return (
    <>
      <div className='flex-col items-center h-screen w-screen'>
        <div className='fixed top-0 left-1/4 min-w-3xl'>
          <MyCoverImage />
        </div>

      </div>


    </>




  );
}
