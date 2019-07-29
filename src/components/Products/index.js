import React, {Component} from 'react';
import Layout from '../Layout/Layout';
import ProductTable from '../Misc/ProductTable';
import http from '../../libs/http';
import CustomModal from "../Misc/CustomModal";
import uniqueId from 'react-html-id';
import {Button, FormGroup, Input, Label} from "reactstrap";
import Image from "../../Image/user2-160x160.jpg";
import ReactFileReader from 'react-file-reader';

export default class Products extends Component {
    constructor(props) {
        super(props);

        uniqueId.enableUniqueIds(this);

        this.state = {
            products: [],
            showModal: false,
            product: {
                id: '',
                name: '',
                description: '',
                category_id: '',
                full_price: '',
                photo: '',
                quantity: '',
                sale_price: ''
            },
            reRender: false,
            mode: 'add'
        };
    };

    _toggle = () => {
        const {showModal} = this.state;

        this.setState({
            showModal: !showModal
        });
    };

    async componentDidUpdate(prevProps, prevState, snapshot) {
        const {reRender} = this.state;

        if (!prevState.reRender && reRender) {
            await this._getProducts();
        }
    }

    async componentDidMount() {
        await this._getProducts();
    }

    _getProducts = async () => {
        let res = await http.route('products').get();

        if (!res.isError) {
            let products = res.data;

            this.setState({
                products,
                reRender: false
            });
        }
    };

    _addProduct = () => {
        this.setState({
            showModal: true,
            category: {
                id: '',
                name: '',
                description: '',
                category_id: '',
                full_price: '',
                photo: '',
                quantity: '',
                sale_price: ''
            },
            mode: 'add'
        });
    };

    _save = async () => {
        const {product} = this.state;

        let request = {
            name: product.name,
            description: product.description,
            category_id: product.category_id,
            full_price: product.full_price,
            photo: product.photo,
            quantity: product.quantity,
            sale_price: product.sale_price
        };

        let sale = 0;
        const quantity = product.quantity;

        if(quantity >= 100) {
            sale = product.full_price - product.full_price /100*10;
        }

        if(quantity < 100) {
            sale = product.full_price;
        }

        if (product.id !== '') {
            let res = await http.route(`product/${product.id}`).patch(request);
        } else {
            let res = await http.route(`product`).post(request);
        }

        this.setState({
            showModal: false,
            reRender: true
        });
    };

    _edit = (item) => {
        this.setState({
            product: item,
            showModal: true,
            mode: 'edit'
        });
    };

    _delete = async (id) => {
        await http.route(`product/${id}`).delete();

        const arr = this.state.products.filter((row) => row.id !==id);
        this.setState({products: arr});
    };

    _onChangeProduct = e => {
        const {product} = this.state;
        const {name, value} = e.target;

        this.setState({
            product: {
                ...product,
                [name]: value
            }
        });
    };

    onFileUpload = (files) => {
        const {product} = this.state;
        const imgName = files.fileList[0].name;
        this.setState({
            product: {
                ...product,
                photo: imgName
            }
        });
    };

    render() {
        const {products, showModal, product, mode} = this.state;

        let columns = [
            {
                name: 'Id',
                property: 'id',
                width: '5%'
            },
            {
                name: 'Name',
                property: 'name',
                width: '15%'
            },
            {
                name: 'Description',
                property: 'description',
                width: '24%'
            },
            {
                name: 'Category',
                property: 'category_id',
                width: '6%'
            },
            {
                name: 'Full price',
                property: 'full_price',
                width: '8%'
            },
            {
                name: 'Image',
                property: 'photo',
                width: '13%'
            },
            {
                name: 'Quantity',
                property: 'quantity',
                width: '6%'
            },
            {
                name: 'Sale price',
                property: 'sale_price',
                width: '8%'
            },
            {
                name: "Actions",
                property: 'actions',
                width: "12%"
            }
        ];

        return (
            <Layout>
                <Button onClick={this._addProduct}>Add product</Button>
                <CustomModal title={mode === 'add' ? 'Add product' : 'Edit product'}
                             toggle={this._toggle}
                             showModal={showModal}
                             actionText="Save"
                             action={this._save}>
                    <FormGroup>
                        <Label for={this.nextUniqueId()}>Name</Label>
                        <Input type="text" name="name" value={product.name} id={this.lastUniqueId()}
                               placeholder="Name..." onChange={this._onChangeProduct} />
                    </FormGroup>

                    <FormGroup>
                        <Label for={this.nextUniqueId()}>Description</Label>
                        <Input type="text" name="description" value={product.description} id={this.lastUniqueId()}
                               placeholder="Description..." onChange={this._onChangeProduct} />
                    </FormGroup>

                    <FormGroup>
                        <Label for={this.nextUniqueId()}>Category</Label>
                        <Input type="text" name="category_id" value={product.category_id} id={this.lastUniqueId()}
                               placeholder="Category..." onChange={this._onChangeProduct} />
                    </FormGroup>

                    <FormGroup>
                        <Label for={this.nextUniqueId()}>Full price</Label>
                        <Input type="text" name="full_price" value={product.full_price} id={this.lastUniqueId()}
                               placeholder="Full price..." onChange={this._onChangeProduct} />
                    </FormGroup>

                    <FormGroup>
                        <Label for={this.nextUniqueId()}>Image</Label>
                        <ReactFileReader fileTypes={[".jpg", ".png"]} base64={true} multipleFiles={false} handleFiles={(x, y) => this.onFileUpload(x, y)}>
                            <span>
                                <button>
                                    Choose File
                                </button>
                            </span>
                        </ReactFileReader>
                    </FormGroup>

                    <FormGroup>
                        <Label for={this.nextUniqueId()}>Qunatity</Label>
                        <Input type="text" name="quantity" value={product.quantity} id={this.lastUniqueId()}
                               placeholder="Quantity..." onChange={this._onChangeProduct} />
                    </FormGroup>
                </CustomModal>

                <ProductTable
                    columns={columns}
                    items={products}
                    editItem={this._edit}
                    deleteItem={this._delete}
                />
            </Layout>
        );
    }
}
