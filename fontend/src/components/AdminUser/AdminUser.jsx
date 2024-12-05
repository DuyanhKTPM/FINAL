import React, { useEffect, useRef, useState } from "react";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import TableComponent from "../TableComponent/TableComponent";
import { Button, Form, Space } from "antd";
import InputComponents from "../InputComponents/InputComponents";
import { getBase64 } from "../../utils";
import { useMutationHooks } from "../../hooks/useMutationHooks";
import { useQuery } from "@tanstack/react-query";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import { useSelector } from "react-redux";
import ModalComponent from "../ModalComponent/ModalComponent";
import * as Message from "../../components/Message/Message";
import { WrapperHeader } from "./style";
import { WrapperUploadFile } from "./style";
import * as UserService from "../../service/UserService";
import ColumnSearch from "../ColumnSearch/ColumnSearch"

const AdminUser = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [form] = Form.useForm();
  const [rowSelected, setRowSelected] = useState("");
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const user = useSelector((state) => state?.user);
  // const [searchText, setSearchText] = useState('');
  // const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  const [stateUserDetails, setStateUserDetails] = useState({
    name: "",
    email: "",
    role: "User",
    phone: "",
    avatar: "",
    address: "",
  });

  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    const res = UserService.updateUser(id, { ...rests }, token);
    return res;
  });

  const mutationDelete = useMutationHooks((data) => {
    const { id, token } = data;
    const res = UserService.deleteUser(id, token);
    return res;
  });
  const mutationDeleteMany = useMutationHooks((data) => {
    const { token, ...ids } = data;
    const res = UserService.deleteManyUser(ids, token);
    return res;
  });

  const getAllUsers = async () => {
    const res = await UserService.getAllUser();
    return res;
  };
  const queryUser = useQuery({
    queryKey: ["user"],
    queryFn: getAllUsers,
  });
  const { data: users } = queryUser;

  const fetchGetDetailsUser = async (rowSelected) => {
    const res = await UserService.getDetailsUser(
      rowSelected,
      user.access_token
    );
    if (res?.data) {
      setStateUserDetails({
        name: res?.data?.name,
        email: res?.data?.email,
        role: res?.data?.role,
        phone: res?.data?.phone,
        avatar: res?.data?.avatar,
        address: res?.data?.address,
      });
    }
  };

  useEffect(() => {
    form.setFieldsValue(stateUserDetails);
  }, [form, stateUserDetails]);

  useEffect(() => {
    if (rowSelected) {
      fetchGetDetailsUser(rowSelected);
    }
  }, [rowSelected]);

  const handleDetailsUser = () => {
    setIsOpenDrawer(true);
  };

  const renderAction = () => {
    return (
      <div>
        <DeleteOutlined
          style={{
            color: "red",
            fontSize: "16px",
            cursor: "pointer",
            margin: "5px",
          }}
          onClick={() => setIsModalOpenDelete(true)}
        />
        <EditOutlined
          style={{
            color: "blue",
            fontSize: "16px",
            cursor: "pointer",
            margin: "5px",
          }} dataIndex
          onClick={handleDetailsUser}
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
      title: "Tên người dùng",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      ...ColumnSearch({ dataIndex: "name" }),

    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.name.length - b.name.length,
      ...ColumnSearch({ dataIndex: "email" }),

    },
    {
      title: "Phân quyền",
      dataIndex: "role",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      sorter: (a, b) => a.address.length - b.address.length,
      ...ColumnSearch({ dataIndex: "address" }),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      sorter: (a, b) => String(a.phone).localeCompare(String(b.phone)),
      ...ColumnSearch({ dataIndex: "phone" }),
    },
    {
      title: "Tác vụ",
      dataIndex: "action",
      render: renderAction,
    },
  ];

  const dataTable =
    users?.data?.length &&
    users?.data
      .filter((user) => user.role !== "Admin") // Bỏ qua admin
      .map((user) => {
        return {
          ...user,
          key: user._id,
          role: user?.role,
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
  const {
    data: dataDeleteMany,
    isSuccess: isSuccessDeleteMany,
    isError: isErrorDeleteMany,
  } = mutationDeleteMany;

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };
  const handleDeleteUser = () => {
    mutationDelete.mutate(
      { id: rowSelected, token: user?.access_token },
      {
        onSettled: () => {
          queryUser.refetch();
        },
      }
    );
  };
  const handleDeleteManyUser = (ids) => {
    mutationDeleteMany.mutate(
      { ids: ids, token: user?.access_token },
      {
        onSettled: () => {
          queryUser.refetch();
        },
      }
    );
  };
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
      Message.success();
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
  useEffect(() => {
    if (isSuccessDeleteMany && dataDeleteMany?.status === "OK") {
      Message.success();
    } else if (isErrorDeleteMany) {
      Message.error();
    }
  }, [isSuccessDeleteMany]);

  const handleOnChangeDetails = (e) => {
    setStateUserDetails((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  // const handleOnchangeAvatar = async ({ file }) => {
  //     if (file && file.originFileObj) {
  //         const base64 = await getBase64(file.originFileObj)
  //         setStateUser(prevState => ({
  //             ...prevState,
  //             image: base64
  //         }))
  //     }
  // };

  const handleOnchangeAvatarDetails = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateUserDetails((prevState) => ({
      ...prevState,
      avatar: file.preview,
    }));
  };

  const onUpdateUser = () => {
    mutationUpdate.mutate(
      { id: rowSelected, token: user?.access_token, ...stateUserDetails },
      {
        onSettled: () => {
          queryUser.refetch();
        },
      }
    );
    setIsOpenDrawer(false);
    setStateUserDetails({
      name: "",
      email: "",
      address: "",
      phone: "",
      image: "",
    });
    form.resetFields();
  };

  return (
    <div>
      <WrapperHeader>Quản lý người dùng</WrapperHeader>
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
          handleDeleteMany={handleDeleteManyUser}
          columns={columns}
          data={dataTable}
          onRow={(record) => {
            return {
              onClick: (event) => {
                setRowSelected(record._id);
              },
            };
          }}
        />
      </div>

      <DrawerComponent
        title="Chi tiết người dùng"
        isOpen={isOpenDrawer}
        onClose={() => setIsOpenDrawer(false)}
        width="75%"
      >
        <Form
          name="basic"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          onFinish={onUpdateUser}
          autoComplete="on"
          form={form}
        >
          <Form.Item
            label="Tên Người Dùng"
            name="name"
            rules={[{ message: "Please input name user!" }]}
          >
            <InputComponents
              disabled
              value={stateUserDetails.name}
              onChange={handleOnChangeDetails}
              name="name"
            />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input email user!" }]}
          >
            <InputComponents
              value={stateUserDetails.email}
              onChange={handleOnChangeDetails}
              name="email"
            />
          </Form.Item>

          <Form.Item
            label="Địa Chỉ"
            name="address"
            rules={[{ required: true, message: "Please input address user!" }]}
          >
            <InputComponents
              value={stateUserDetails.address}
              onChange={handleOnChangeDetails}
              name="address"
            />
          </Form.Item>

          <Form.Item
            label="SĐT"
            name="phone"
            rules={[{ required: true, message: "Please input phone user!" }]}
          >
            <InputComponents
              value={stateUserDetails.phone}
              onChange={handleOnChangeDetails}
              name="phone"
            />
          </Form.Item>

          <Form.Item
            label="Hình Ảnh"
            name="image"
            rules={[{ required: true, message: "Please input image product!" }]}
          >
            <WrapperUploadFile
              onChange={handleOnchangeAvatarDetails}
              maxCount={1}
            >
              <Button>Select File</Button>
              {stateUserDetails?.avatar && (
                <img
                  src={stateUserDetails?.avatar}
                  style={{
                    height: "60px",
                    width: "60px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginLeft: "10px",
                  }}
                  alt="avatar"
                />
              )}
            </WrapperUploadFile>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </DrawerComponent>
      <ModalComponent
        forceRender
        title="Xóa người dùng"
        open={isModalOpenDelete}
        onCancel={handleCancelDelete}
        onOk={handleDeleteUser}
      >
        <div>{`Bạn có muốn xóa người dùng không?`}</div>
      </ModalComponent>
    </div>
  );
};
export default AdminUser;
