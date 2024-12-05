import { Button, Form, Space } from "antd";
import { WrapperHeader } from "../AdminUser/style";
import { useEffect, useRef, useState } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import TableComponent from "../TableComponent/TableComponent";
import { useMutationHooks } from "../../hooks/useMutationHooks";
import * as StoreService from "../../service/StoreService";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import ModalComponent from "../ModalComponent/ModalComponent";
import InputComponents from "../InputComponents/InputComponents";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import * as Message from "../../components/Message/Message";

const AdminStore = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [form] = Form.useForm();
  const [rowSelected, setRowSelected] = useState("");
  const [typeSelect, setTypeSelect] = useState("");
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const user = useSelector((state) => state?.user);
  // const [searchText, setSearchText] = useState('');
  // const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const inittial = () => ({
    name: "",
    x: 0.1,
    y: 0.1,
  });
  const [stateStore, setStateStore] = useState(inittial());
  const [stateStoreDetails, setStateStoreDetails] = useState(inittial());

  const mutation = useMutationHooks((data) => {
    const res = StoreService.createStore({
      ...data,
    });
    return res;
  });
  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    const res = StoreService.updateStore(id, token, rests);
    return res;
  });

  const mutationDelete = useMutationHooks((data) => {
    const { id, token } = data;
    const res = StoreService.deleteStore(id, token);
    return res;
  });
  const mutationDeleteMany = useMutationHooks((data) => {
    const { token, ...ids } = data;
    const res = StoreService.deleteManyStore(ids, token);
    return res;
  });

  const getAllStores = async () => {
    const res = await StoreService.getAllStore("", 100);
    return res;
  };
  const queryStore = useQuery({
    queryKey: ["Stores"],
    queryFn: getAllStores,
  });
  const { data: Stores } = queryStore;

  const fetchGetDetailsStore = async (rowSelected) => {
    const res = await StoreService.getDetailsStore(rowSelected);
    if (res?.data) {
      setStateStoreDetails({
        name: res?.data?.name,
        x: res?.data?.x,
        y: res?.data?.y,
      });
    }
  };

  useEffect(() => {
    if (!isModalOpen) {
      form.setFieldsValue(stateStoreDetails);
    } else {
      form.setFieldsValue(inittial());
    }
  }, [form, stateStoreDetails, isModalOpen]);

  useEffect(() => {
    if (rowSelected) {
      fetchGetDetailsStore(rowSelected);
    }
  }, [rowSelected]);

  const handleDetailsStore = () => {
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
          }}
          onClick={handleDetailsStore}
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
      title: "Tên cửa hàng",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
    },

    {
      title: "Kinh độ (X)",
      dataIndex: "x",
    },
    {
      title: "Vĩ độ (Y)",
      dataIndex: "y",
    },

    {
      title: "Tác vụ",
      dataIndex: "action",
      render: renderAction,
    },
  ];

  const dataTable =
    Stores?.data?.length &&
    Stores?.data?.map((Store) => {
      return { ...Store, key: Store._id };
    });
  const { data, isSuccess, isError } = mutation;
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
  const handleDeleteStore = () => {
    mutationDelete.mutate(
      { id: rowSelected, token: user?.access_token },
      {
        onSettled: () => {
          queryStore.refetch();
        },
      }
    );
  };
  const handleDeleteManyStores = (ids) => {
    mutationDeleteMany.mutate(
      { ids: ids, token: user?.access_token },
      {
        onSettled: () => {
          queryStore.refetch();
        },
      }
    );
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setStateStore({
      name: "",
      x: 0.1,
      y: 0.1,
    });
    form.resetFields();
  };
  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      handleCancel();
      Message.success();
    } else if (isError) {
      Message.error();
    }
  }, [isSuccess, isError]);
  useEffect(() => {
    if (isSuccessUpdate && dataUpdate?.status === "OK") {
      Message.success();
    } else if (isErrorUpdate) {
      Message.error();
    }
  }, [isSuccessUpdate, isErrorUpdate]);
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

  const onFinish = () => {
    const params = {
      name: stateStore?.name,
      x: stateStore?.x,
      y: stateStore?.y,
    };
    mutation.mutate(params, {
      onSettled: () => {
        queryStore.refetch();
        handleCancel();
      },
    });
  };

  const handleOnChange = (e) => {
    setStateStore((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  const handleOnChangeDetails = (e) => {
    setStateStoreDetails({
      ...stateStoreDetails,
      [e.target.name]: e.target.value,
    });
  };

  const onUpdateStore = () => {
    mutationUpdate.mutate(
      { id: rowSelected, token: user?.access_token, ...stateStoreDetails },
      {
        onSettled: () => {
          queryStore.refetch();
        },
      }
    );
    setIsOpenDrawer(false);
  };

  return (
    <div>
      <WrapperHeader>Quản lý cửa hàng</WrapperHeader>
      <div>
        <Button
          style={{
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
          handleDeleteMany={handleDeleteManyStores}
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

      <ModalComponent
        forceRender
        title="Tạo cửa hàng"
        open={isModalOpen}
        onCancel={handleCancel}
        footer=""
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFinish}
          autoComplete="on"
          form={form}
        >
          <Form.Item
            label="Tên Cửa Hàng"
            name="name"
            rules={[{ required: true, message: "Nhập tên cửa hàng!" }]}
          >
            <InputComponents
              value={stateStore.name}
              onChange={handleOnChange}
              name="name"
            />
          </Form.Item>

          <Form.Item
            label="Kinh Độ"
            name="x"
            rules={[{ required: true, message: "Nhập kinh độ (X) cửa hàng!" }]}
          >
            <InputComponents
              value={stateStore.x}
              onChange={handleOnChange}
              name="x"
            />
          </Form.Item>

          <Form.Item
            label="Vĩ Độ"
            name="y"
            rules={[{ required: true, message: "Nhập vĩ độ (Y) cửa hàng!" }]}
          >
            <InputComponents
              value={stateStore.y}
              onChange={handleOnChange}
              name="y"
            />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </ModalComponent>
      <DrawerComponent
        title="Chi tiết cửa hàng"
        isOpen={isOpenDrawer}
        onClose={() => setIsOpenDrawer(false)}
        width="75%"
      >
        <Form
          name="update"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          onFinish={onUpdateStore}
          autoComplete="on"
          form={form}
        >
          <Form.Item
            label="Tên Cửa Hàng"
            name="name"
            rules={[{ required: true, message: "Nhập tên cửa hàng!" }]}
          >
            <InputComponents
              value={stateStoreDetails.name}
              onChange={handleOnChangeDetails}
              name="name"
            />
          </Form.Item>

          <Form.Item
            label="Kinh Độ"
            name="x"
            rules={[{ required: true, message: "Nhập kinh độ (X) cửa hàng!" }]}
          >
            <InputComponents
              value={stateStoreDetails.x}
              onChange={handleOnChangeDetails}
              name="x"
            />
          </Form.Item>

          <Form.Item
            label="Vĩ Độ"
            name="y"
            rules={[{ required: true, message: "Nhập vĩ độ (Y) cửa hàng!" }]}
          >
            <InputComponents
              value={stateStoreDetails.y}
              onChange={handleOnChangeDetails}
              name="y"
            />
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
        title="Xóa sản phẩm"
        open={isModalOpenDelete}
        onCancel={handleCancelDelete}
        onOk={handleDeleteStore}
      >
        <div>{`Bạn có muốn xóa cửa hàng không?`}</div>
      </ModalComponent>
    </div>
  );
};
export default AdminStore;
