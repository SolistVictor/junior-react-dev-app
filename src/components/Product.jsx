import React, { Component } from 'react';
import './product.css';
import { Context } from '../context/Context';


class Product extends Component {
    constructor(props) {
        super(props)
    }
    static contextType = Context;

   
    displayProductContent = () => {
        let data = this.props.data;
        if (data.loading) {
            return <div>Loading...</div>
        }
        else
        
        {
            return (
                <div className='main_product'>
                    
                        <div className='product'>

                            <div className='additional_photos'>
                                {data.product.gallery.map((img, id) => 
                                    <img className='additional_photos_img' src={img} key={id} alt={id} />
                                )}
                                
                            </div>

                            <div className='product_picture'>
                                <img className='product_img' src={data.product.gallery[0]} alt="qwdqd" />
                            </div>

                            <div className='product_info'>
                                <p style={{fontSize: '2rem'}}>{data.product.name}</p>

                                {data.product.attributes.map((attribute, id) =>
                                    <div className='product_attributes' key={id}>
                                        <p className='p_title'>
                                            {attribute.name}:
                                        </p>
                                        <p className='p_attribute'>
                                            {attribute.items.map((item, id) =>
                                                <button
                                                    className='btn_attribute'
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
                                <p style={{ fontWeight: 900 }}>{data.product.prices[0].currency.symbol}
                                    {data.product.prices[0].amount}
                                </p>

                                <div>
                                    <button className='btn_add'>Add to cart</button>
                                </div>

                                <div>
                                    <p className='p_description' 
                                    dangerouslySetInnerHTML={{__html: data.product.description}}>
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
