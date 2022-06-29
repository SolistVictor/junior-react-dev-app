import React, { Component } from 'react';
import { Context } from '../context/Context';
import './product.css';
import { Link } from 'react-router-dom';



class Product extends Component {
    constructor(props) {
        super(props)

        this.state = {
            imageId: '0',
            selectedAttributesId: [],
            disabled: true

        }
    }

    componentDidMount() {
        this.context.addItemToSelectedProducts(this.props.data.product);

    }

    componentDidUpdate() {
        if (this.state.disabled === false) {
            return;
        }
        let selectedProduct = this.context.state.selectedProducts.find(el => el.id === this.props.data.product.id);
        for (let i = 0; i < selectedProduct.selectedAttributesId.length; i++) {
            if (selectedProduct.selectedAttributesId[i] === undefined) {            
                return;
            }
        }
        if (selectedProduct.selectedAttributesId.length === this.props.data.product.attributes.length) {
            this.setState({ disabled: false });
        }
    }

    static contextType = Context;
    //id param
    addToCart = (product) => {
        this.context.addCartItemToStore(product, this.state.selectedAttributesId);
    }

    changeProductAttribute = (product, attributeId, id) => {
        this.context.onSelectedAttributesChange(product.id, attributeId, id);
    }

    styleSwitcher = (id, attributeId, name, productId) => {
        
        let selectedAttributesId = this.context.state.selectedProducts.find(el => el.id === productId)
        if (selectedAttributesId === undefined) {
            selectedAttributesId = undefined;
        }   
        else {
            selectedAttributesId = selectedAttributesId.selectedAttributesId[attributeId];
        }
        
        if (selectedAttributesId === id && name === 'Color') {
            return 'btn_color_selected'
        }
        if (name === 'Color') {
            return 'btn_color'
        }
        if (selectedAttributesId === id && name !== 'Color') {
            return 'btn_attribute_selected'
        }
        else if (name !== 'Color') {
            return 'btn_attribute'
        }
    }

    displayProductContent = () => {
        let data = this.props.data;
        let currencyIndex = this.context.state.currencyId;
        if (data.loading) {
            return <div>Loading...</div>
        }
        else {
            return (
                <div className='main_product'>

                    <div className='product'>

                        <div className='additional_photos'>
                            {data.product.gallery.map((img, id) =>
                                <img className='additional_photos_img' src={img} key={id} alt={id} onClick={() => this.setState({ imageId: id })} />
                            )}
                        </div>

                        <div className='product_picture'>
                            <img className='product_img' src={data.product.gallery[this.state.imageId]} alt="qwdqd" />
                        </div>

                        <div className='product_info'>
                            <p style={{ fontSize: '2rem' }}>{data.product.name}</p>

                            {data.product.attributes.map((attribute, attributeId) =>
                                <div className='product_attributes' key={attributeId}>
                                    <p className='p_title'>
                                        {attribute.name}:
                                    </p>
                                    <p className='p_attribute'>
                                        {attribute.items.map((item, id) =>
                                            <button
                                                onClick={() => this.changeProductAttribute(
                                                    data.product, attributeId, id)}
                                                className={this.styleSwitcher(id, attributeId, attribute.name, data.product.id)}
                                                style={{ backgroundColor: item.value }}
                                                key={id}>
                                                {attribute.name === 'Color' ? '' : item.value}
                                            </button>
                                        )}
                                    </p>

                                </div>
                            )}

                            <p className='p_title'>
                                Price:
                            </p>
                            <p style={{ fontWeight: 900 }}>{data.product.prices[currencyIndex].currency.symbol}
                                {data.product.prices[currencyIndex].amount}
                            </p>
                            <Link to='/cart'>
                                <button
                                    disabled={this.state.disabled}
                                    onClick={() => this.addToCart(data.product)} className='btn_add'>
                                    Add to cart
                                </button>
                            </Link>


                            <div>
                                <p className='p_description'
                                    dangerouslySetInnerHTML={{ __html: data.product.description }}>
                                </p>
                            </div>
                        </div>


                    </div>

                </div>
            )
        }
    }

    render() {
        return (
            <div>
                {this.displayProductContent()}
            </div>
        );
    }
}

export default Product;
