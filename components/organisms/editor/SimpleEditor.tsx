import { useEffect, useMemo, useState } from 'react';
import YooptaEditor, {
  Blocks,
  createYooptaEditor,
  generateId,
  YooptaBlockData,
  YooptaContentValue,
} from '@yoopta/editor';
import Paragraph from '@yoopta/paragraph';

const plugins = [Paragraph];

export const SimpleEditor = () => {
  const editor = useMemo(() => createYooptaEditor(), []);
  const [value, setValue] = useState<YooptaContentValue>();

  const onChange = (value: YooptaContentValue) => {
    setValue(value);
  };

  useEffect(() => {
    editor.withoutSavingHistory(() => {
      const id = generateId();
      const blockData: YooptaBlockData = Blocks.buildBlockData({ id });
      editor.setEditorValue({ [id]: blockData });
      editor.focusBlock(id);
    });
  }, [editor]);

  return (
    <YooptaEditor
      className='pb-0! overflow-y-auto'
      editor={editor}
      plugins={plugins}
      value={value}
      onChange={onChange}
      selectionBoxRoot={false}
      width='100%'
    />
  );
};
