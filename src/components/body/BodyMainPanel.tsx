import * as React from "react";
import { LayoutContextActionTypes } from "../../@interface";
import { useDatagridContext } from "../../context/DatagridContext";
import {
  useDatagridLayoutContext,
  useDatagridLayoutDispatch
} from "../../context/DatagridLayoutContext";
import BodyTable from "./BodyTable";

interface IProps {
  startRowIndex: number;
  endRowIndex: number;
  styleTop: number;
  styleLeft: number;
}
const BodyMainPanel: React.FC<IProps> = ({
  startRowIndex,
  endRowIndex,
  styleTop,
  styleLeft,
}) => {
  const context = useDatagridContext();
  const layoutContext = useDatagridLayoutContext();
  const layoutDispatch = useDatagridLayoutDispatch();
  const { _bodyWidth = 1, _bodyHeight = 1 } = layoutContext;
  const { dataLength, bodyRowHeight = 20 } = context;

  const lineNumberColumnWidth = React.useMemo(() => {
    return context.enableLineNumber
      ? layoutContext._lineNumberColumnWidth || 50
      : 0;
  }, [context.enableLineNumber, layoutContext._lineNumberColumnWidth]);

  const containerStyle = React.useMemo(
    () => ({
      left: lineNumberColumnWidth,
      width: _bodyWidth - lineNumberColumnWidth,
      height: _bodyHeight,
    }),
    [_bodyWidth, _bodyHeight, lineNumberColumnWidth]
  );

  const bodyContentWidth = React.useMemo(() => {
    return (context._colGroup || [])
      .map((n) => n._width || 0)
      .reduce((acc, cur) => {
        return acc + cur;
      }, 0);
  }, [context._colGroup]);

  const contentContainerStyle = React.useMemo(
    () => ({
      paddingLeft: styleLeft,
      paddingTop: styleTop,
      height: dataLength * bodyRowHeight,
      width: bodyContentWidth,
    }),
    [styleTop, styleLeft, dataLength, bodyRowHeight, bodyContentWidth]
  );

  if (!context._colGroup || context._colGroup.length < 1) {
    return null;
  }
  const onScroll: React.UIEventHandler<HTMLDivElement> = (e) => {
    const { scrollTop } = e.currentTarget;

    layoutDispatch({
      type: LayoutContextActionTypes.SET_SCROLL_TOP,
      scrollTop
    })
  }

  return (
    <div className="ac-datagrid--body--main__panel"
      onScroll={onScroll}
      style={containerStyle}
    >
      <div data-panel={"scroll-content"} style={contentContainerStyle}>
        <BodyTable
          columns={context._colGroup}
          startRowIndex={startRowIndex}
          endRowIndex={endRowIndex}
        />
      </div>
    </div>
  );
};

export default React.memo(BodyMainPanel);
