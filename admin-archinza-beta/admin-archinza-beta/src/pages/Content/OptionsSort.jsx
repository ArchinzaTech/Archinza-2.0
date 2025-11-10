import React, { useState, useEffect } from "react";
import { List, Modal, notification } from "antd";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
// import datas from "./data";

// import VirtualList from "rc-virtual-list";
import http from "../../helpers/http";
import config from "../../config/config";
import { DragHandle } from "../../components/DragHandle";

const OptionsSort = ({ isOpen, onClose, datas, question }) => {
  const [datalist, setdatalist] = useState([]);
  const [loading, setloading] = useState(false);

  const base_url = config.api_url + "admin/content/options/sort/" + question; //without trailing slash

  useEffect(() => {
    setdatalist(datas);
  }, [datas]);

  const handleOrder = async (updatedData) => {
    setloading(true);

    // return;
    const { data } = await http.put(`${base_url}`, updatedData);

    if (data) {
      notification["success"]({
        message: ` Sorting Updated Successfully`,
      });
      onClose();
    }
    setloading(false);
  };

  return (
    <>
      {/* <h1>Inside Options Modal</h1> */}
      <Modal
        title="Ordering"
        open={isOpen}
        onOk={() => {
          handleOrder(datalist);
        }}
        okText="Update"
        confirmLoading={loading}
        onCancel={onClose}
      >
        <DragDropContext
          onDragEnd={(param) => {
            const id = param.draggableId;
            const srcI = param.source.index;
            const sort_order = param.destination?.index;

            if (sort_order != undefined) {
              // handleOrder(id,sort_order);
              let temparray = [...datalist];
              temparray.splice(sort_order, 0, temparray.splice(srcI, 1)[0]);

              setdatalist(temparray);
              //   datas.saveList(datalist);
            }
          }}
        >
          <div>
            <Droppable droppableId="droppable-1">
              {(provided, _) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{ maxHeight: 400, overflow: "auto" }}
                >
                  <List
                    // footer={<div>Footer</div>}
                    bordered
                    dataSource={datalist}
                    renderItem={(item, i) => (
                      <>
                        <Draggable
                          key={`key${i}`}
                          draggableId={`key${i}`}
                          index={i}
                        >
                          {(provided, snapshot) => (
                            <div ref={provided.innerRef}>
                              <List.Item
                                {...provided.draggableProps}
                                style={{
                                  ...provided.draggableProps.style,
                                  boxShadow: snapshot.isDragging
                                    ? "0 0 .4rem #666"
                                    : "none",
                                }}
                              >
                                <span>{item || "-"}</span>
                                <DragHandle {...provided.dragHandleProps} />
                              </List.Item>
                            </div>
                          )}
                        </Draggable>
                      </>
                    )}
                  />

                  {/* {datalist.map((item, i) => (
                  <Draggable
                    key={item.id}
                    draggableId={"draggable-" + item.id}
                    index={i}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={{
                          ...provided.draggableProps.style,
                          boxShadow: snapshot.isDragging
                            ? "0 0 .4rem #666"
                            : "none",
                        }}
                      >
                        <DragHandle {...provided.dragHandleProps} />
                        <span>{item.title}</span>
                      </div>
                    )}
                  </Draggable>
                ))} */}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </DragDropContext>
      </Modal>
    </>
  );
};

export default OptionsSort;
