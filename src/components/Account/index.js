import React, {Component} from 'react';
import Layout from '../Layout/Layout';
import UserTable from '../Misc/UserTable';
import http from '../../libs/http';
import CustomModal from "../Misc/CustomModal";
import uniqueId from 'react-html-id';
import {Button, FormGroup, Input, Label} from "reactstrap";
import ReactFileReader from "react-file-reader";

const images = require.context('../../Image', true);

export default class Profile extends Component {
    constructor(props) {
        super(props);

        uniqueId.enableUniqueIds(this);

        this.state = {
            users: [],
            showModal: false,
            user: {
                id: '',
                name: '',
                email: '',
                picture: ''
            },
            reRender: false
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
            await this._getUsers();
        }
    }

    async componentDidMount() {
        await this._getUsers();
    }

    _getUsers = async () => {
        let res = await http.route('users').get();

        if (!res.isError) {
            let users = res.data;

            this.setState({
                users,
                reRender: false
            });
        }
    };

    _save = async () => {
        const { user } = this.state;

        let request = {
            name: user.name,
            email: user.email,
            picture: user.picture
        };

        if (user.id !== '') {
            await http.route(`user/${user.id}`).patch(request);
        }

        this.setState({
            showModal: false,
            reRender: true
        });
    };

    _edit = (item) => {
        this.setState({
            user: item,
            showModal: true,
            mode: 'edit'
        });
    };

    _onChangeUser = e => {
        const {user} = this.state;
        const {name, value} = e.target;

        this.setState({
            user: {
                ...user,
                [name]: value
            }
        });
    };

    onFileUpload = (files) => {
        const {user} = this.state;
        const imgName = files.fileList[0].name;
        this.setState({
            user: {
                picture: imgName,
                ...user
            }
        });
    };

    render() {
        const {users, showModal, user, mode} = this.state;

        let columns = [
            {
                name: 'Id',
                property: 'id',
                width: '15%'
            },
            {
                name: 'Name',
                property: 'name',
                width: '25%'
            },
            {
                name: 'Email',
                property: 'email',
                width: '20%'
            },
            {
                name: 'Picture',
                property: 'picture',
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
                <CustomModal title={'Edit user'}
                             toggle={this._toggle}
                             showModal={showModal}
                             actionText="Save"
                             action={this._save}>
                    <FormGroup>
                        <Label for={this.nextUniqueId()}>Name</Label>
                        <Input type="text" name="name" value={user.name} id={this.lastUniqueId()}
                               placeholder="Name..." onChange={this._onChangeUser}/>
                    </FormGroup>
                    <FormGroup>
                        <Label for={this.nextUniqueId()}>Email</Label>
                        <Input type="text" name="email" value={user.email} id={this.lastUniqueId()}
                               placeholder="Email..." onChange={this._onChangeUser}/>
                    </FormGroup>
                    <FormGroup>
                        <Label for={this.nextUniqueId()}>Picture</Label>
                        <ReactFileReader fileTypes={[".jpg", ".png"]} base64={true} multipleFiles={false} handleFiles={(x, y) => this.onFileUpload(x, y)}>
                            <span>
                                <button>
                                    Choose File
                                </button>
                            </span>
                        </ReactFileReader>
                    </FormGroup>

                </CustomModal>
                <UserTable
                    columns={columns}
                    items={users}
                    editItem={this._edit}
                />
            </Layout>
        );
    }
}
