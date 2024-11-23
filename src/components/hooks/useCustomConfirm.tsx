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

export type UseCustomConfirmOption<ContentProps = undefined> = {
  /** コンテンツを描画する */
  renderContent: (props: {
    /** コンテンツに渡すprops */
    props?: ContentProps;
    /** 処理中か */
    processing: boolean;
    /** OKアクションを実行する */
    ok: () => void;
    /** キャンセルする */
    cancel: () => void;
  }) => ReactElement;
};

/** クリック時に実行されるハンドラー */
type ActionHandler = () => void | Promise<void>;

export type ReturnUseCustomConfirm<ContentProps = undefined> = {
  /** 確認ダイアログを出す */
  confirm: (
    props: {
      onOk: ActionHandler;
    } & AdditionalContentProps<ContentProps>
  ) => void;
  /** ダイアログ要素 */
  dialogElement: ReactElement;
};

/**
 * カスタマイズされた確認ダイアログを呼び出すhooks
 */
export const useCustomConfirm = function <ContentProps = undefined>({
  renderContent,
}: UseCustomConfirmOption<ContentProps>): ReturnUseCustomConfirm<ContentProps> {
  // 非同期処理中かを管理するフラグ
  const [isProcessing, setIsProcessing] = useState(false);
  // ダイアログコンテンツ内でOKボタンを押したときに実行するメソッドをstateで持つ
  const [execOk, setExecOk] = useState<ActionHandler | null>(null);
  // 追加で渡すpropsをstateで持つ
  const [contentProps, setContentProps] = useState<ContentProps>();

  const handleOk = useCallback(() => {
    if (execOk == null) {
      return;
    }
    const result = execOk();
    // OK時の処理がPromiseでないときは即閉じる
    if (!(result instanceof Promise)) {
      setExecOk(null);
      return;
    }

    // OK時の処理がPromiseだった場合、処理中のフラグを立てて、resolveした時に閉じるようにする
    setIsProcessing(true);
    result
      .then(() => {
        setExecOk(null);
      })
      .catch((err) => {
        console.log("catch reject", err);
      })
      .finally(() => {
        setIsProcessing(false);
      });
  }, [execOk]);

  const handleClose = useCallback(() => {
    // 処理中の時は閉じれないようにする
    if (isProcessing) {
      return;
    }
    setExecOk(null);
  }, [isProcessing]);

  const confirm: ReturnUseCustomConfirm<ContentProps>["confirm"] = useCallback(
    ({ onOk, ...restProps }) => {
      if ("props" in restProps) {
        setContentProps(restProps.props as ContentProps);
      }
      setExecOk(() => onOk);
    },
    []
  );

  // ダイアログ内に表示するReactElementを生成する
  const dialogContentElement = renderContent({
    props: contentProps,
    processing: isProcessing,
    ok: handleOk,
    cancel: handleClose,
  });

  // OK時の実行メソッドを持っているかでダイアログを開くか判断する
  const isOpen = execOk != null;
  const dialogElement: ReturnUseCustomConfirm<ContentProps>["dialogElement"] = (
    <Dialog open={isOpen} onClose={handleClose}>
      {dialogContentElement}
    </Dialog>
  );

  return {
    confirm,
    dialogElement,
  };
};
