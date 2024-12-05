import React, { useEffect, useRef, useState } from "react";
import { WrapperHeader, WrapperUploadFile } from "./style";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
// import TableComponent from "../TableComponent/TableComponent";
import { Button, Form, Select, Space } from "antd";
import InputComponents from "../../components/InputComponents/InputComponents";

import { getBase64, renderOptions } from "../../utils";
import * as ProductService from "../../service/ProductService";
import { useMutationHooks } from "../../hooks/useMutationHooks";
import { useQuery } from "@tanstack/react-query";
// import DrawerComponent from "../DrawerComponent/DrawerComponent";
import { useSelector } from "react-redux";
import ModalComponent from "../../components/ModalComponent/ModalComponent";

import * as Message from "../../components/Message/Message";
import TableComponent from "../../components/TableComponent/TableComponent";
import DrawerComponent from "../../components/DrawerComponent/DrawerComponent";

const RetailerProduct = () => {
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
    price: "",
    type: "",
    countInStock: "",
    rating: "",
    discount: "",
    description: "",
    origin: "",
    uses: "",
    report: "",
    preserve: "",
    image: "",
    retailerName: "",
    retailerId: "",
  });
  const [stateProduct, setStateProduct] = useState(inittial());
  const [stateProductDetails, setStateProductDetails] = useState(inittial());

  const mutation = useMutationHooks((data) => {
    const res = ProductService.createProduct({
      ...data,
      retailerName: user?.name,
      retailerId: user?.id,
    });
    return res;
  });
  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    const res = ProductService.updateProduct(id, token, rests);
    return res;
  });

  const mutationDelete = useMutationHooks((data) => {
    const { id, token } = data;
    const res = ProductService.deleteProduct(id, token);
    return res;
  });
  const mutationDeleteMany = useMutationHooks((data) => {
    const { token, ...ids } = data;
    const res = ProductService.deleteManyProduct(ids, token);
    return res;
  });

  const getAllProductRetailer = async () => {
    const res = await ProductService.getAllProductRetailer(user?.id, "", 100);
    return res;
  };
  const queryProduct = useQuery({
    queryKey: ["products"],
    queryFn: getAllProductRetailer,
  });
  const { data: products } = queryProduct;

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct();
    return res;
  };
  const typeProduct = useQuery({
    queryKey: ["type-products"],
    queryFn: fetchAllTypeProduct,
  });

  const fetchGetDetailsProduct = async (rowSelected) => {
    const res = await ProductService.getDetailsProduct(rowSelected);
    if (res?.data) {
      setStateProductDetails({
        name: res?.data?.name,
        price: res?.data?.price,
        type: res?.data?.type,
        countInStock: res?.data?.countInStock,
        rating: res?.data?.rating,
        description: res?.data?.description,
        image: res?.data?.image,
        discount: res?.data?.discount,
        uses: res?.data?.uses,
        report: res?.data?.report,
        preserve: res?.data?.preserve,
        origin: res?.data?.origin,
      });
    }
  };

  useEffect(() => {
    if (!isModalOpen) {
      form.setFieldsValue(stateProductDetails);
    } else {
      form.setFieldsValue(inittial());
    }
  }, [form, stateProductDetails, isModalOpen]);

  useEffect(() => {
    if (rowSelected) {
      fetchGetDetailsProduct(rowSelected);
    }
  }, [rowSelected]);

  const handleDetailsProduct = () => {
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
          onClick={handleDetailsProduct}
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
      title: "Tên sản phẩm",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Giá sản phẩm",
      dataIndex: "price",
      sorter: (a, b) => a.price - b.price,
      filters: [
        {
          text: ">=50",
          value: ">=",
        },
        {
          text: "<50",
          value: "<",
        },
      ],
      onFilter: (value, record) => {
        if (value === ">=") {
          return record.price >= 50;
        } else if (value === "<") {
          return record.price < 50;
        }
      },
    },
    {
      title: "Đánh giá",
      dataIndex: "rating",
      sorter: (a, b) => a.rating - b.rating,
      filters: [
        {
          text: ">=3",
          value: ">=",
        },
        {
          text: "<3",
          value: "<",
        },
      ],
      onFilter: (value, record) => {
        if (value === ">=") {
          return Number(record.rating) >= 3;
        } else if (value === "<") {
          return record.rating < 3;
        }
      },
    },
    {
      title: "Loại sản phẩm",
      dataIndex: "type",
    },
    {
      title: "Tác vụ",
      dataIndex: "action",
      render: renderAction,
    },
  ];

  const dataTable =
    products?.data?.length &&
    products?.data?.map((product) => {
      return { ...product, key: product._id };
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
  const handleDeleteProduct = () => {
    mutationDelete.mutate(
      { id: rowSelected, token: user?.access_token },
      {
        onSettled: () => {
          queryProduct.refetch();
        },
      }
    );
  };
  const handleDeleteManyProducts = (ids) => {
    mutationDeleteMany.mutate(
      { ids: ids, token: user?.access_token },
      {
        onSettled: () => {
          queryProduct.refetch();
        },
      }
    );
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setStateProduct({
      name: "",
      price: "",
      type: "",
      countInStock: "",
      rating: "",
      description: "",
      image: "",
      discount: "",
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
      name: stateProduct?.name,
      price: stateProduct?.price,
      type: stateProduct?.type,
      countInStock: stateProduct?.countInStock,
      rating: stateProduct?.rating,
      description: stateProduct?.description,
      image: stateProduct?.image,
      discount: stateProduct?.discount,
      origin: stateProduct?.origin,
      uses: stateProduct?.uses,
      report: stateProduct?.report,
      preserve: stateProduct?.preserve,
    };
    mutation.mutate(params, {
      onSettled: () => {
        queryProduct.refetch();
        handleCancel();
      },
    });
  };

  const handleOnChange = (e) => {
    setStateProduct((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  const handleOnChangeDetails = (e) => {
    setStateProductDetails({
      ...stateProductDetails,
      [e.target.name]: e.target.value,
    });
  };
  const handleOnchangeAvatar = async ({ file }) => {
    if (file && file.originFileObj) {
      const base64 = await getBase64(file.originFileObj);
      setStateProduct((prevState) => ({
        ...prevState,
        image: base64,
      }));
    }
  };

  const handleOnchangeAvatarDetails = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateProductDetails({
      ...stateProductDetails,
      image: file.preview,
    });
  };

  const onUpdateProduct = () => {
    mutationUpdate.mutate(
      { id: rowSelected, token: user?.access_token, ...stateProductDetails },
      {
        onSettled: () => {
          queryProduct.refetch();
        },
      }
    );
    setIsOpenDrawer(false);
  };
  const handleChangeSelect = (value) => {
    if (value !== "add_type") {
      setStateProduct({
        ...stateProduct,
        type: value,
      });
    } else {
      setTypeSelect(value);
    }
  };

  return (
    <div>
      <WrapperHeader>Quản lý sản phẩm</WrapperHeader>
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
          handleDeleteMany={handleDeleteManyProducts}
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
        title="Tạo sản phẩm"
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
            label="Tên Sản Phẩm"
            name="name"
            rules={[{ required: true, message: "Nhập tên sản phẩm!" }]}
          >
            <InputComponents
              value={stateProduct.name}
              onChange={handleOnChange}
              name="name"
            />
          </Form.Item>

          <Form.Item
            label="Loại Sản Phẩm"
            name="type"
            rules={[{ required: true, message: "Nhập loại sản phẩm!" }]}
          >
            <Select
              name="type"
              onChange={handleChangeSelect}
              options={renderOptions(typeProduct?.data?.data)}
            />
            {typeSelect === "add_type" && (
              <InputComponents
                value={stateProduct.type}
                onChange={handleOnChange}
                name="type"
              />
            )}
          </Form.Item>

          <Form.Item
            label="Giá Sản Phẩm"
            name="price"
            rules={[{ required: true, message: "Nhập giá sản phẩm!" }]}
          >
            <InputComponents
              value={stateProduct.price}
              onChange={handleOnChange}
              name="price"
            />
          </Form.Item>

          <Form.Item
            label="Số Lượng Sản Phẩm"
            name="countInStock"
            rules={[
              {
                required: true,
                message: "Nhập số lượng sản phẩm!",
              },
            ]}
          >
            <InputComponents
              value={stateProduct.countInStock}
              onChange={handleOnChange}
              name="countInStock"
            />
          </Form.Item>

          <Form.Item
            label="Đánh Giá"
            name="rating"
            rules={[{ required: true, message: "Nhập đánh giá sản phẩm!" }]}
          >
            <InputComponents
              value={stateProduct.rating}
              onChange={handleOnChange}
              name="rating"
            />
          </Form.Item>

          <Form.Item
            label="Giảm Giá"
            name="discount"
            rules={[{ required: false, message: "Nhập giảm giá sản phẩm!" }]}
          >
            <InputComponents
              value={stateProduct.discount}
              onChange={handleOnChange}
              name="discount"
            />
          </Form.Item>

          <Form.Item
            label="Mô Tả Sản Phẩm"
            name="description"
            rules={[{ required: true, message: "Nhập mô tả sản phẩm!" }]}
          >
            <InputComponents
              value={stateProduct.description}
              onChange={handleOnChange}
              name="description"
            />
          </Form.Item>

          <Form.Item
            label="Xuất Xứ"
            name="origin"
            rules={[{ message: "Nhập xuất xứ sản phẩm!", required: true }]}
          >
            <InputComponents
              value={stateProduct.origin}
              onChange={handleOnChange}
              name="origin"
            />
          </Form.Item>

          <Form.Item
            label="Công Dụng"
            name="uses"
            rules={[{ required: true, message: "Nhập công dụng sản phẩm!" }]}
          >
            <InputComponents
              value={stateProduct.uses}
              onChange={handleOnChange}
              name="uses"
            />
          </Form.Item>

          <Form.Item
            label="Cảnh Báo An Toàn"
            name="report"
            rules={[
              { required: true, message: "Nhập cảnh báo an toàn sản phẩm!" },
            ]}
          >
            <InputComponents
              value={stateProduct.report}
              onChange={handleOnChange}
              name="report"
            />
          </Form.Item>

          <Form.Item
            label="Bảo Quản"
            name="preserve"
            rules={[{ required: true, message: "Nhập bảo quản sản phẩm!" }]}
          >
            <InputComponents
              value={stateProduct.preserve}
              onChange={handleOnChange}
              name="preserve"
            />
          </Form.Item>

          <Form.Item
            label="Hình Ảnh"
            name="image"
            rules={[{ required: true, message: "Thêm hình ảnh sản phẩm!" }]}
          >
            <WrapperUploadFile onChange={handleOnchangeAvatar} maxCount={1}>
              <Button>Select File</Button>
              {stateProduct?.image && (
                <img
                  src={stateProduct.image}
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
      </ModalComponent>
      <DrawerComponent
        title="Chi tiết sản phẩm"
        isOpen={isOpenDrawer}
        onClose={() => setIsOpenDrawer(false)}
        width="75%"
      >
        <Form
          name="basic"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          onFinish={onUpdateProduct}
          autoComplete="on"
          form={form}
        >
          <Form.Item
            label="Tên Sản Phẩm"
            name="name"
            rules={[{ required: true, message: "Nhập tên sản phẩm!" }]}
          >
            <InputComponents
              value={stateProductDetails.name}
              onChange={handleOnChangeDetails}
              name="name"
            />
          </Form.Item>

          <Form.Item
            label="Loại Sản Phẩm"
            name="type"
            rules={[{ required: true, message: "Nhập loại sản phẩm!" }]}
          >
            <InputComponents
              value={stateProductDetails.type}
              onChange={handleOnChangeDetails}
              name="type"
            />
          </Form.Item>

          <Form.Item
            label="Giá Sản Phẩm"
            name="price"
            rules={[{ required: true, message: "Nhập giá sản phẩm!" }]}
          >
            <InputComponents
              value={stateProductDetails.price}
              onChange={handleOnChangeDetails}
              name="price"
            />
          </Form.Item>

          <Form.Item
            label="Số Lượng Sản Phẩm"
            name="countInStock"
            rules={[
              {
                required: true,
                message: "Nhập số lượng sản phẩm!",
              },
            ]}
          >
            <InputComponents
              value={stateProductDetails.countInStock}
              onChange={handleOnChangeDetails}
              name="countInStock"
            />
          </Form.Item>

          <Form.Item
            label="Đánh Giá"
            name="rating"
            rules={[{ required: true, message: "Nhập đánh giá sản phẩm!" }]}
          >
            <InputComponents
              value={stateProductDetails.rating}
              onChange={handleOnChangeDetails}
              name="rating"
            />
          </Form.Item>

          <Form.Item
            label="Giảm Giá"
            name="discount"
            rules={[{ required: false, message: "Nhập giảm giá sản phẩm!" }]}
          >
            <InputComponents
              value={stateProductDetails.discount}
              onChange={handleOnChangeDetails}
              name="discount"
            />
          </Form.Item>

          <Form.Item
            label="Mô Tả Sản Phẩm"
            name="description"
            rules={[{ required: true, message: "Nhập mô tả sản phẩm!" }]}
          >
            <InputComponents
              value={stateProductDetails.description}
              onChange={handleOnChangeDetails}
              name="description"
            />
          </Form.Item>

          <Form.Item
            label="Xuất Xứ"
            name="origin"
            rules={[{ required: true, message: "Nhập xuất xứ sản phẩm!" }]}
          >
            <InputComponents
              value={stateProductDetails.origin}
              onChange={handleOnChangeDetails}
              name="origin"
            />
          </Form.Item>

          <Form.Item
            label="Công Dụng"
            name="uses"
            rules={[{ required: true, message: "Nhập công dụng sản phẩm!" }]}
          >
            <InputComponents
              value={stateProductDetails.uses}
              onChange={handleOnChangeDetails}
              name="uses"
            />
          </Form.Item>

          <Form.Item
            label="Cảnh Báo An Toàn"
            name="report"
            rules={[
              { required: true, message: "Nhập cảnh báo an toàn sản phẩm!" },
            ]}
          >
            <InputComponents
              value={stateProductDetails.report}
              onChange={handleOnChangeDetails}
              name="report"
            />
          </Form.Item>

          <Form.Item
            label="Bảo Quản"
            name="preserve"
            rules={[{ required: true, message: "Nhập bảo quản sản phẩm!" }]}
          >
            <InputComponents
              value={stateProductDetails.preserve}
              onChange={handleOnChangeDetails}
              name="preserve"
            />
          </Form.Item>

          <Form.Item
            label="Hình Ảnh"
            name="image"
            rules={[{ required: true, message: "Thêm hình ảnh!" }]}
          >
            <WrapperUploadFile
              onChange={handleOnchangeAvatarDetails}
              maxCount={1}
            >
              <Button>Select File</Button>
              {stateProductDetails?.image && (
                <img
                  src={stateProductDetails?.image}
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
        title="Xóa sản phẩm"
        open={isModalOpenDelete}
        onCancel={handleCancelDelete}
        onOk={handleDeleteProduct}
      >
        <div>{`Bạn có muốn xóa sản phẩm không?`}</div>
      </ModalComponent>
    </div>
  );
};
export default RetailerProduct;
