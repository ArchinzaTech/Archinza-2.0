import { cloneElement, forwardRef } from "react";
import { List, AutoSizer } from "react-virtualized";

export const VirtualizedListBox = forwardRef(function VirtualizedListBox(
  props,
  ref
) {
  const { children, role, ...other } = props;
  const itemCount = Array.isArray(children) ? children.length : 0;

  return (
    <div ref={ref}>
      <div style={{ width: "100%", height: "25vh" }} {...other}>
        <AutoSizer>
          {({ width, height }) => (
            <List
              height={height}
              width={width}
              rowHeight={35}
              overscanCount={5}
              rowCount={itemCount}
              rowRenderer={(props) => {
                return cloneElement(children[props.index], {
                  style: props.style,
                });
              }}
              role={role}
            />
          )}
        </AutoSizer>
      </div>
    </div>
  );
});
