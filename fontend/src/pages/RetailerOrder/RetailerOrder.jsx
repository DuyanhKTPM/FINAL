import React, { useEffect, useRef, useState } from "react";
import {
  PlusOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { Button, Form, Space } from "antd";
import { useMutationHooks } from "../../hooks/useMutationHooks";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import * as Message from "../../components/Message/Message";
import { WrapperHeader } from "./style";
import * as OrderService from "../../service/OrderService";
import { useLocation, useNavigate } from "react-router";
import InputComponents from "../../components/InputComponents/InputComponents";
import TableComponent from "../../components/TableComponent/TableComponent";
import ModalComponent from "../../components/ModalComponent/ModalComponent";

const RetailerOrder = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [isModalOpenSubmit, setIsModalOpenSubmit] = useState(false);

  const [rowSelected, setRowSelected] = useState("");
  const location = useLocation();
  const { state } = location;
  const user = useSelector((state) => state?.user);
  const navigate = useNavigate();

  const searchInput = useRef(null);

  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, order } = data;
    const res = OrderService.updateOrder(id, order, token);
    return res;
  });
  const mutationDelete = useMutationHooks((data) => {
    const { id, token, orderItems, userId } = data;
    const res = OrderService.cancelOrder(id, token, orderItems, userId);
    return res;
  });
  // const mutationDeleteMany = useMutationHooks((data) => {
  //   const { token, ...ids } = data;
  //   const res = UserService.deleteManyUser(ids, token);
  //   return res;
  // });

  const getOrderRetailer = async () => {
    const res = await OrderService.getOrderRetailer(user.id, user.access_token);
    return res;
  };
  const queryUser = useQuery({
    queryKey: ["order"],
    queryFn: getOrderRetailer,
  });
  const { data: orders } = queryUser;

  // const fetchGetDetailsUser = async (rowSelected) => {
  //   const res = await UserService.getDetailsUser(
  //     rowSelected,
  //     user.access_token
  //   );
  //   if (res?.data) {
  //     setStateUserDetails({
  //       name: res?.data?.name,
  //       email: res?.data?.email,
  //       role: res?.data?.role,
  //       phone: res?.data?.phone,
  //       avatar: res?.data?.avatar,
  //       address: res?.data?.address,
  //     });
  //   }
  // };

  // useEffect(() => {
  //   form.setFieldsValue(stateUserDetails);
  // }, [form, stateUserDetails]);

  // useEffect(() => {
  //   if (rowSelected) {
  //     fetchGetDetailsUser(rowSelected);
  //   }
  // }, [rowSelected]);

  const handleDetailsOrder = (id) => {
    navigate(`/details-order/${id}`, {
      state: {
        token: state?.token,
      },
    });
  };
  const renderAction = (orders) => {
    return (
      <div>
        <CheckOutlined
          style={{
            color: orders.isPaid ? "gray" : "green", // Nếu isPaid là true, đổi màu thành gray
            fontSize: "16px",
            cursor: orders.isPaid ? "not-allowed" : "pointer", // Đổi cursor nếu isPaid
            margin: "5px",
          }}
          onClick={() => {
            if (!orders.isPaid) {
              // Chỉ mở modal nếu isPaid là false
              setIsModalOpenSubmit(true);
            }
          }}
        />
        <DeleteOutlined
          style={{
            color: "red",
            fontSize: "16px",
            cursor: "pointer",
            margin: "5px",
          }}
          onClick={() => setIsModalOpenDelete(true)}
        />
        <EyeOutlined
          style={{
            color: "blue",
            fontSize: "16px",
            cursor: "pointer",
            margin: "5px",
          }}
          onClick={() => handleDetailsOrder(orders._id)}
        />
      </div>
    );
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
  };
  const handleReset = (clearFilters) => {
    clearFilters();
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <InputComponents
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={`${selectedKeys[0] || ""}`}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "_id",
      sorter: (a, b) => a._id.length - b._id.length,
      ...getColumnSearchProps("_id"),
    },
    {
      title: "Người mua hàng",
      dataIndex: "fullName",
      sorter: (a, b) => a.fullName.length - b.fullName.length,
      ...getColumnSearchProps("fullName"),
    },
    {
      title: "Cửa hàng",
      dataIndex: "retailerName",
      ...getColumnSearchProps("retailerName"),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      sorter: (a, b) => a.totalPrice.length - b.totalPrice.length,
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => renderAction(record),
    },
  ];

  const dataTable =
    orders?.data?.length &&
    orders?.data?.map((order) => {
      return {
        ...order,
        fullName: order?.shippingAddress?.fullName,
      };
    });
  const {
    data: dataUpdate,
    isSuccess: isSuccessUpdate,
    isError: isErrorUpdate,
  } = mutationUpdate;

  const {
    data: dataDelete,
    isSuccess: isSuccessDelete,
    isError: isErrorDelete,
  } = mutationDelete;

  // const {
  //   data: dataDeleteMany,
  //   isSuccess: isSuccessDeleteMany,
  //   isError: isErrorDeleteMany,
  // } = mutationDeleteMany;

  const handleCancelOrder = (orders) => {
    mutationDelete.mutate(
      {
        id: orders._id,
        token: user.access_token,
        orderItems: orders?.orderItems,
        userId: user.id,
      },
      {
        onSuccess: () => {
          queryUser.refetch();
        },
      }
    );
  };
  const handleSubmitOrder = (orders) => {
    mutationUpdate.mutate(
      {
        id: orders._id,
        token: user.access_token,
        order: orders,
      },
      {
        onSuccess: () => {
          queryUser.refetch();
        },
      }
    );
  };

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
    setIsModalOpenSubmit(false);
  };

  // const handleDeleteManyUser = (ids) => {
  //   mutationDeleteMany.mutate(
  //     { ids: ids, token: user?.access_token },
  //     {
  //       onSettled: () => {
  //         queryUser.refetch();
  //       },
  //     }
  //   );
  // };
  // const onFinish = () => {
  //     mutation.mutate(stateUser, {
  //         onSettled: () => {
  //             queryUser.refetch()
  //             handleCancel()
  //         }
  //     })
  // }
  // useEffect(() => {
  //     if (isSuccess && data?.status === 'OK') {
  //         handleCancel()
  //         Message.success()
  //     } else if (isError) {
  //         Message.error()
  //     }
  // }, [isSuccess])
  useEffect(() => {
    if (isSuccessUpdate && dataUpdate?.status === "OK") {
      handleCancelDelete();
      Message.success("Đơn hàng đã hoàn thành");
    } else if (isErrorUpdate) {
      Message.error();
    }
  }, [isSuccessUpdate]);
  useEffect(() => {
    if (isSuccessDelete && dataDelete?.status === "OK") {
      handleCancelDelete();
      Message.success();
    } else if (isErrorDelete) {
      Message.error();
    }
  }, [isSuccessDelete]);
  // useEffect(() => {
  //   if (isSuccessDeleteMany && dataDeleteMany?.status === "OK") {
  //     Message.success();
  //   } else if (isErrorDeleteMany) {
  //     Message.error();
  //   }
  // }, [isSuccessDeleteMany]);

  return (
    <div>
      <WrapperHeader>Quản lý đơn hàng</WrapperHeader>
      <div>
        <Button
          style={{
            display: "none",
            height: "50px",
            width: "50px",
            color: "blue",
            backgroundColor: "white",
            margin: "10px",
          }}
          onClick={() => setIsModalOpen(true)}
        >
          <PlusOutlined />
        </Button>
      </div>
      <div>
        <TableComponent
          // handleDeleteMany={handleDeleteManyUser}
          columns={columns}
          data={dataTable}
          onRow={(record) => {
            return {
              onClick: (event) => {
                setRowSelected(record);
              },
            };
          }}
        />
      </div>
      <ModalComponent
        forceRenders
        title="Hoàn thành đơn hàng"
        open={isModalOpenSubmit}
        onCancel={handleCancelDelete}
        onOk={() => handleSubmitOrder(rowSelected)}
      >
        <div>{`Hoàn thành giao hàng!`}</div>
      </ModalComponent>
      <ModalComponent
        forceRenders
        title="Xóa người dùng"
        open={isModalOpenDelete}
        onCancel={handleCancelDelete}
        onOk={() => handleCancelOrder(rowSelected)}
      >
        <div>{`Bạn có muốn xóa đơn hàng này không?`}</div>
      </ModalComponent>
    </div>
  );
};
export default RetailerOrder;
