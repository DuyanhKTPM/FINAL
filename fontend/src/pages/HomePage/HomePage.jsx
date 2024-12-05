import React, { useEffect, useState, useMemo } from "react";
import TypeProduct from "../../components/TypeProduct/TypeProduct";
import {
  WrapperButtonMore,
  WrapperProducts,
  WrapperTypeProduct,
} from "./style";
import SliderComponent from "../../components/SilederComponent/SliderComponent";
import Baner1 from "../../assets/images/Baner1.png";
import Baner2 from "../../assets/images/Baner2.png";
import Baner3 from "../../assets/images/Baner3.png";
import CardComponent from "../../components/CardComponent/CardComponent";
import { useQuery } from "@tanstack/react-query";
import * as ProductService from "../../service/ProductService";
import { useSelector } from "react-redux";
import { useDebounce } from "../../hooks/useDebounce";


const HomePage = () => {
  const searchProduct = useSelector((state) => state?.product?.search);
  const searchDebounce = useDebounce(searchProduct, 800);
  const [limit, setLimit] = useState(6);
  const [typeProducts, setTypeProducts] = useState([]);

  const fetchProductAll = async (context) => {
    const limit = context?.queryKey && context?.queryKey[1];
    const search = context?.queryKey && context?.queryKey[2];
    const res = await ProductService.getAllProduct(search, limit);
    return res;
  };

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct();
    if (res?.status === "OK") {
      setTypeProducts(res?.data);
    }
  };

  const { data: products } = useQuery({
    queryKey: ["products", limit, searchDebounce],
    queryFn: fetchProductAll,
    retry: 3,
    keepPreviousData: true,
  });

  useEffect(() => {
    fetchAllTypeProduct();
  }, []);

  const topSellerProducts = useMemo(() => {
    if (!products?.data || products?.data.length === 0) return [];
    const sortedProducts = [...products.data].sort(
      (a, b) => b.selled - a.selled
    );
    return sortedProducts.slice(0, 6); // Đổi số 3 nếu bạn muốn lấy top n sản phẩm
  }, [products]);

  return (
    <>
      <div style={{ padding: "0 120px" }}>
        <WrapperTypeProduct>
          {typeProducts.length > 0 ? (
            typeProducts.map((item) => <TypeProduct name={item} key={item} />)
          ) : (
            <p>Không tìm thấy sản phẩm</p>
          )}
        </WrapperTypeProduct>
      </div>
      <div className="body" style={{ width: "100%", backgroundColor: "#e7dee2" }}>
        <div id="container" style={{ height: "100%", width: "100%" }}>
          <SliderComponent arrImages={[Baner1, Baner2, Baner3]} />
          <p style={{ paddingLeft: "100px", fontSize: "25px" }}>TẤT CẢ SẢN PHẨM</p>

          <div style={{ margin: "0 auto", textAlign: "center" }}>
            <WrapperProducts>
              {products?.data
                .filter((pro) => {
                  if (searchDebounce === "") {
                    return pro;
                  } else if (
                    pro?.name
                      ?.toLowerCase()
                      ?.includes(searchDebounce?.toLowerCase())
                  ) {
                    return pro;
                  }
                })
                .map((data) => (
                  <CardComponent
                    key={data._id}
                    countInStock={data.countInStock}
                    description={data.description}
                    image={data.image}
                    name={data.name}
                    price={data.price}
                    rating={data.rating}
                    type={data.type}
                    selled={data.selled}
                    discount={data.discount}
                    id={data._id}
                  />
                ))}
            </WrapperProducts>
          </div>

          <div
            style={{
              width: "20%",
              display: "flex",
              justifyContent: "center",
              margin: "0 auto",
              paddingTop: "20px",
            }}
          >
            <WrapperButtonMore
              textButton="Xem Thêm"
              type="outline"
              styleButton={{
                border: "1px solid rgb(11,116,229)",
                background: "#fff",
                color: `${products?.total === products?.data?.length
                  ? "#ccc"
                  : "rgb(11,116,229)"
                  }`,
                width: "40%",
                height: "38px",
                borderRadius: "4px",
                marginBottom: "20px",
              }}
              styleTextButton={{ fontWeight: 500, color: "blue" }}
              onClick={() => setLimit((prev) => prev + 6)}
              disabled={
                products?.total === products?.data?.length ||
                products?.totalPage === 1
              }
            />
          </div>
        </div>
      </div>

      <div
        style={{
          fontSize: "30px",
          paddingTop: "10px",
          backgroundColor: "#e7dee2",
          borderTop: "2px solid #fff",
          paddingBottom: "100px"
        }}
      >
        <p style={{ paddingLeft: "100px", fontSize: "25px" }}>SẢN PHẨM BÁN CHẠY</p>
        <div style={{ margin: "0 auto", textAlign: "center" }}>
          <WrapperProducts>
            {topSellerProducts.length > 0 ? (
              topSellerProducts.map((product) => (
                <CardComponent
                  style={{ width: "20%", height: "200px" }}
                  key={product._id}
                  countInStock={product.countInStock}
                  description={product.description}
                  image={product.image}
                  name={product.name}
                  price={product.price}
                  rating={product.rating}
                  type={product.type}
                  selled={product.selled}
                  discount={product.discount}
                  id={product._id}
                />
              ))
            ) : (
              <h2
                style={{
                  fontSize: "30px",
                  color: "green",
                  display: "flex",
                }}
              >
                Không Tìm Thấy Sản Phẩm
              </h2>
            )}
          </WrapperProducts>
        </div>
        <script
          src="https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1"
        ></script>
        <df-messenger
          intent="WELCOME"
          chat-title="Chatbot1"
          agent-id="cb7ffed2-370e-4edc-aeb3-dec23c3bf7c5"
          language-code="vi"
        ></df-messenger>
      </div>
    </>
  );
};

export default HomePage;
