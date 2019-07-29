import React, {Component} from 'react';
import Layout from '../Layout/Layout';
import Table from '../Misc/Table';
import http from '../../libs/http';
import CustomModal from "../Misc/CustomModal";
import uniqueId from 'react-html-id';
import {Button, FormGroup, Input, Label} from "reactstrap";

export default class Categories extends Component {
    constructor(props) {
        super(props);

        uniqueId.enableUniqueIds(this);

        this.state = {
            parentCategories: [],
            categories: [],
            showModal: false,
            category: {
                id: '',
                name: '',
                parent_id: ''
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
            await this._getCategories();
        }
    }

    async componentDidMount() {
        await this._getCategories();
    }

    _getCategories = async () => {
        let res = await http.route('categories').get();

        if (!res.isError) {
            let categories = res.data;

            let parentCategories = [];

            categories.length > 0 && categories.map((item, k) => {
                if (item.parent_id == 0) {
                    parentCategories.push(item);
                }
            });

            this.setState({
                categories,
                parentCategories,
                reRender: false
            });
        }
    };

    _addCategory = () => {
        this.setState({
            showModal: true,
            category: {
                id: '',
                name: '',
                parent_id: ''
            },
            mode: 'add'
        });
    };

    _save = async () => {
        const {category} = this.state;

        let request = {
            name: category.name
        };

        if (category.parent_id != '' && category.parent_id != 0) {
            request.parent_id = category.parent_id;
        }

        if (category.id !== '') {
            let res = await http.route(`category/${category.id}`).patch(request);
        } else {
            let res = await http.route(`category`).post(request);
        }

        this.setState({
            showModal: false,
            reRender: true
        });
    };

    _edit = (item) => {
        this.setState({
            category: item,
            showModal: true,
            mode: 'edit'
        });
    };

    _delete = async (id) => {
        await http.route(`category/${id}`).delete();

        const arr = this.state.categories.filter((row) => row.id !==id);
        this.setState({categories: arr});
    };

    _onChangeCategory = e => {
        const {category} = this.state;
        const {name, value} = e.target;

        this.setState({
            category: {
                ...category,
                [name]: value
            }
        });
    };

    render() {
        const {categories, showModal, category, parentCategories, mode} = this.state;

        let columns = [
            {
                name: 'Id',
                property: 'id',
                width: '15%'
            },
            {
                name: 'Name',
                property: 'name',
                width: '45%'
            },
            {
                name: 'Parent',
                property: 'parent_id',
                width: '20%'
            },
            {
                name: "Actions",
                property: 'actions',
                width: "15%"
            }
        ];

        return (
            <Layout>
                <Button onClick={this._addCategory}>Add category</Button>
                <CustomModal title={mode === 'add' ? 'Add category' : 'Edit category'}
                             toggle={this._toggle}
                             showModal={showModal}
                             actionText="Save"
                             action={this._save}>
                    <FormGroup>
                        <Label for={this.nextUniqueId()}>Name</Label>
                        <Input type="text" name="name" value={category.name} id={this.lastUniqueId()}
                               placeholder="Name..." onChange={this._onChangeCategory}/>
                    </FormGroup>
                    <FormGroup>
                        <Label for={this.nextUniqueId()}>Parent category</Label>
                        <Input type="select" name="parent_id" id={this.lastUniqueId()}
                               value={category.parent_id} onChange={this._onChangeCategory}>
                            <option value={0}>Select</option>
                            {parentCategories.length > 0 && parentCategories.map((item, k) => {
                                if (item.id !== category.id) {
                                    return <option key={k} value={item.id}>{item.name}</option>;
                                }
                            })}
                        </Input>
                    </FormGroup>
                </CustomModal>
                <Table
                    columns={columns}
                    items={categories}
                    editItem={this._edit}
                    deleteItem={this._delete}
                />
            </Layout>
        );
    }
}
