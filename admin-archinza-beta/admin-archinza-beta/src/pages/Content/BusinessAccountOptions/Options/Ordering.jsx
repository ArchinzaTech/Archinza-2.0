import React, { useState, useEffect } from "react";
import { List, Modal, notification, Image } from "antd";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
// import datas from "./data";

// import VirtualList from "rc-virtual-list";
import http from "../../../../helpers/http";

import { DragHandle } from "../../../../components/DragHandle";

const Ordering = ({
  isOpen,
  onClose,
  data,
  sortOption,
  moduleName,
  base_url,
}) => {
  const [datalist, setdatalist] = useState([]);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    setdatalist(data);
  }, [data]);

  const handleOrder = async (updatedData) => {
    setloading(true);
    const { data } = await http.put(
      `${base_url}admin/content/business-options/sort-options/${sortOption}`,
      updatedData
    );
    console.log(data);
    if (data) {
      notification["success"]({
        message: `${moduleName} Sorting Updated Successfully`,
      });
      onClose();
    }
    setloading(false);
  };

  return (
    <>
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
            // const id = param.draggableId;
            const srcI = param.source.index;
            const sort_order = param.destination?.index;

            if (sort_order !== undefined) {
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
                        <Draggable key={item} draggableId={item} index={i}>
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
                                {/* <Image
                                 width={isMobile ? 80 : 100}
                                  src={image_url + item.image}
                                  fallback="https://via.placeholder.com/100"
                                /> */}
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

export default Ordering;
