import React, { useState, useEffect } from "react";
import { Button, Dropdown, List, Menu, Modal, notification, Radio } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
// import datas from "./data";

// import VirtualList from "rc-virtual-list";
import http from "../../helpers/http";
import config from "../../config/config";
import { DragHandle } from "../../components/DragHandle";

const BusinessOptionsSort = ({
  isOpen,
  onClose,
  datas,
  option,
  businessType,
}) => {
  const [datalist, setdatalist] = useState([]);
  const [loading, setloading] = useState(false);
  
  const base_url = `${config.api_url}admin/content/business-options/sort/${businessType}/${option}`;

  useEffect(() => {
    if (option == "min_fees") {
      setdatalist(datas.map((it) => it.fee));
    } else if (option == "budget") {
      setdatalist(datas.map((it) => it.type));
    } else {
      setdatalist(datas);
    }
  }, [datas]);

  const handleOrder = async (updatedData) => {
    setloading(true);
    if (option == "min_fees") {
      updatedData = updatedData.map((fee) =>
        datas.find((item) => item.fee === fee)
      );
    }
    if (option == "budget") {
      updatedData = updatedData.map((fee) =>
        datas.find((item) => item.type === fee)
      );
    }

    const { data } = await http.put(`${base_url}`, updatedData);

    if (data) {
      notification["success"]({
        message: ` Sorting Updated Successfully`,
      });
      onClose();
    }
    setloading(false);
  };

  const getSortLabels = (option) => {
    if (["min_fees", "budget", "project_sizes"].includes(option)) {
      return {
        asc: "Low to High",
        desc: "High to Low",
      };
    } else {
      return {
        asc: "Sort A to Z",
        desc: "Sort Z to A",
      };
    }
  };

  const handleProjectSizesSort = (data, sortType) => {
    return data.sort((a, b) => {
      const parseValue = (str) => {
        if (str.includes("Above")) {
          return Infinity;
        }
        const range = str.match(/(\d+)/g).map(Number);
        return range[0]; // Return the starting value of the range
      };

      const valueA = parseValue(a);
      const valueB = parseValue(b);

      if (sortType === "asc") {
        return valueA - valueB;
      } else if (sortType === "desc") {
        return valueB - valueA;
      }
    });
  };

  const handleAvgProjectBudgets = (data, sortType) => {
    return data.sort((a, b) => {
      const parseValue = (str) => {
        if (str.includes("Anything")) {
          return sortType === "asc" ? Infinity : -Infinity;
        }
        if (str.includes("Above")) {
          return sortType === "asc" ? Infinity : 5001; // Consider Above 5000 as slightly above 5000
        }
        const range = str.match(/(\d+)/g).map(Number);
        return range[0]; // Return the starting value of the range
      };

      const valueA = parseValue(a);
      const valueB = parseValue(b);

      if (sortType === "asc") {
        return valueA - valueB;
      } else if (sortType === "desc") {
        return valueB - valueA;
      }
    });
  };

  const handleEmployeesRange = (data, sortType) => {
    return data.sort((a, b) => {
      const parseValue = (str) => {
        if (str.includes("Upto")) {
          return 0; // Treat "Upto 10" as 0 for comparison purposes
        }
        if (str.includes("+")) {
          return 1001; // Treat "100+" as above 100 for comparison purposes
        }
        const range = str.match(/(\d+)/g).map(Number);
        return range[0]; // Return the starting value of the range
      };

      const valueA = parseValue(a);
      const valueB = parseValue(b);

      if (sortType === "asc") {
        return valueA - valueB;
      } else if (sortType === "desc") {
        return valueB - valueA;
      }
    });
  };

  const handleQuickSort = async (data, sortType) => {
    let sortedData;
    if (option === "project_sizes") {
      const sortedData = handleProjectSizesSort(data, sortType);
      setdatalist([...sortedData]);
    } else if (option === "budget") {
      const sortedData = handleAvgProjectBudgets(data, sortType);
      setdatalist([...sortedData]);
    } else if (option === "emoployee_count") {
      const sortedData = handleEmployeesRange(data, sortType);
      setdatalist([...sortedData]);
    } else {
      if (sortType === "asc") {
        sortedData = data.sort((a, b) => a.localeCompare(b));
      } else if (sortType === "desc") {
        sortedData = data.sort((a, b) => b.localeCompare(a));
      }
      console.log(JSON.stringify(sortedData));

      setdatalist([...sortedData]);
    }
  };

  return (
    <>
      <Modal
        title="Ordering"
        open={isOpen}
        // onOk={() => {
        //   handleOrder(datalist);
        // }}
        // okText="Update"
        confirmLoading={loading}
        onCancel={onClose}
        footer={[
          <div style={{ float: "left" }}>
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item key="asc">
                    <Button
                      key="asc"
                      type="default"
                      onClick={() => {
                        handleQuickSort(datalist, "asc");
                      }}
                    >
                      <ArrowUpOutlined /> {getSortLabels(option).asc}
                    </Button>
                  </Menu.Item>
                  <Menu.Item key="desc">
                    <Button
                      key="desc"
                      type="default"
                      onClick={() => {
                        handleQuickSort(datalist, "desc");
                      }}
                    >
                      <ArrowDownOutlined /> {getSortLabels(option).desc}
                    </Button>
                  </Menu.Item>
                </Menu>
              }
            >
              <Button
                key="quickSort"
                type="default"
                // onClick={() => handleQuickSort(datalist)}
              >
                Quick Sort
              </Button>
            </Dropdown>
          </div>,
          <Button
            key="update"
            type="primary"
            onClick={() => handleOrder(datalist)}
          >
            Update
          </Button>,
          <Button key="cancel" onClick={onClose}>
            Cancel
          </Button>,
        ]}
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

export default BusinessOptionsSort;
