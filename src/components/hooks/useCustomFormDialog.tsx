import { ReactElement, useState, useCallback } from "react";

import { Dialog } from "@mui/material";

/** ダイアログコンテンツで追加する型 */
type AdditionalContentProps<ContentProps = undefined> = [ContentProps] extends [
  undefined
]
  ? {}
  : {
      props: ContentProps;
    };

/** 送信メソッドの型 */
type SubmitExecuter<SubmitData = undefined> = [SubmitData] extends [undefined]
  ? () => void
  : (submitData: SubmitData) => void;

export type UseCustomFormDialogOption<
  ContentProps = undefined,
  SubmitData = undefined
> = {
  /** コンテンツを描画する */
  renderContent: (props: {
    /** コンテンツに渡すprops */
    props?: ContentProps;
    /** 処理中か */
    processing: boolean;
    /** 送信する */
    submit: SubmitExecuter<SubmitData>;
    /** キャンセルする */
    cancel: () => void;
  }) => ReactElement;
};

/** 送信時に実行されるハンドラー */
type SubmitHandler<SubmitData = undefined> = (
  data: SubmitData
) => void | Promise<void>;

export type ReturnUseCustomFormDialog<
  ContentProps = undefined,
  SubmitData = undefined
> = {
  /** フォームダイアログを表示する */
  open: (
    props: {
      onSubmit: SubmitHandler<SubmitData>;
    } & AdditionalContentProps<ContentProps>
  ) => void;
  /** フォームダイアログを閉じる */
  close: () => void;
  /** ダイアログ要素 */
  dialogElement: ReactElement;
};

export const useCustomFormDialog = function <
  ContentProps = undefined,
  SubmitData = undefined
>({
  renderContent,
}: UseCustomFormDialogOption<
  ContentProps,
  SubmitData
>): ReturnUseCustomFormDialog<ContentProps, SubmitData> {
  const [isProcessing, setIsProcessing] = useState(false);
  const [execSubmit, setExecSubmit] =
    useState<SubmitHandler<SubmitData> | null>(null);
  const [contentProps, setContentProps] = useState<ContentProps>();

  const handleSubmit = useCallback(
    (data: SubmitData) => {
      if (execSubmit == null) {
        return;
      }
      const result = execSubmit(data);
      if (!(result instanceof Promise)) {
        setExecSubmit(null);
        return;
      }

      setIsProcessing(true);
      result
        .then(() => {
          setExecSubmit(null);
        })
        .catch((err) => {
          console.log("catch reject", err);
        })
        .finally(() => {
          setIsProcessing(false);
        });
    },
    [execSubmit]
  );

  const handleClose = useCallback(() => {
    // 処理中は閉じれないようにする
    if (isProcessing) {
      return;
    }
    setExecSubmit(null);
  }, [isProcessing]);

  const open: ReturnUseCustomFormDialog<ContentProps, SubmitData>["open"] =
    useCallback(({ onSubmit, ...restProps }) => {
      if ("props" in restProps) {
        setContentProps(restProps.props as ContentProps);
      }
      setExecSubmit(() => onSubmit);
    }, []);

  const dialogContentElement = renderContent({
    props: contentProps,
    processing: isProcessing,
    submit: handleSubmit as SubmitExecuter<SubmitData>,
    cancel: handleClose,
  });

  const isOpen = execSubmit != null;
  const dialogElement: ReturnUseCustomFormDialog<
    ContentProps,
    SubmitData
  >["dialogElement"] = (
    <Dialog open={isOpen} onClose={handleClose}>
      {dialogContentElement}
    </Dialog>
  );

  return {
    open,
    close: handleClose,
    dialogElement,
  };
};
