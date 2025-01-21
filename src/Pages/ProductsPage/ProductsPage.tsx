import React from "react";
import CircularProductTable from "../../components/ProductsTable/CircularProductsTable";
import RectangularProductTable from "../../components/ProductsTable/RectangularProductTable";
import SquareProductTable from "../../components/ProductsTable/SquareProductTable";

const ProductsPage: React.FC = () => {
    return(
        <>
           <RectangularProductTable/>
           <CircularProductTable/>
           <SquareProductTable/>
        </> 
    )
}
export default ProductsPage;