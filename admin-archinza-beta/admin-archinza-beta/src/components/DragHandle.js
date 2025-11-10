// import { DragIconWrapper } from "../styles";
// import { ReactComponent as DragHandleIcon } from "../drag_handle-black-18dp.svg";
import React from "react";
import {
  SettingOutlined,
MenuOutlined
} from "@ant-design/icons";
export function DragHandle(props) {
  return (
    <div {...props}>
      <MenuOutlined />
    </div>
  );
}
