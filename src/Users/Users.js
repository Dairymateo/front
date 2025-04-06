
import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import { Dialog } from 'primereact/dialog';
import { ConfirmDialog } from 'primereact/confirmdialog'; // Importa ConfirmDialog
import { Toast } from 'primereact/toast'; // Importa Toast
import _viewUser from './_viewUser';
import _addUser from './_addUser';
import _editUser from './_editUser';

function Users() {
    const [users, setUsers] = useState([]);
    const [ShowSiewModel, setShowSiewModel] = useState(false);
    const [ShowAddModel, setShowAddModel] = useState(false);
    const [ShowEditModel, setShowEditModel] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [selectedUserIdForEdit, setSelectedUserIdForEdit] = useState(null);
    const [deleteUserId, setDeleteUserId] = useState(null); // Estado para el ID del usuario a eliminar
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // Estado para mostrar el diálogo de confirmación
    const toast = React.useRef(null); 

    useEffect(() => {
        getAllUsers();
    }, []);

    const getAllUsers = async () => {
        try {
            const response = await axios.get('http://localhost:3000/users');
            if (response) {
                console.log("Usuarios desde backend:", response.data);
                setUsers(response.data);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const confirmDeleteUser = (rowData) => {
        setDeleteUserId(rowData._id);
        setShowDeleteConfirm(true);
    };

    const deleteUser = async () => {
        setShowDeleteConfirm(false);
        try {
            const response = await axios.delete(`http://localhost:3000/users/${deleteUserId}`);
            if (response.status === 200) {
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Usuario eliminado correctamente', life: 3000 });
                getAllUsers(); // Recargar la lista de usuarios
            } else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el usuario', life: 3000 });
            }
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el usuario', life: 3000 });
        }
        setDeleteUserId(null);
    };

    const actionsTemplate = (rowData) => {
        return (
            <div className='botones'>
                <button className='btn btn-success' onClick={() => {
                    setSelectedUserId(rowData._id);
                    setShowSiewModel(true);
                }}>
                    <i className="pi pi-eye"></i>
                </button>
                <button className='btn btn-primary' onClick={() => {
                    setSelectedUserIdForEdit(rowData._id);
                    setShowEditModel(true);
                }}>
                    <i className="pi pi-file-edit"></i>
                </button>
                <button className='btn btn-danger' onClick={() => confirmDeleteUser(rowData)}>
                    <i className="pi pi-trash"></i>
                </button>
            </div>
        );
    };

    return (
        <div className='users-page'>
            <Toast ref={toast} /> 
            <ConfirmDialog
                className="Mensaje-aviso" 
                visible={showDeleteConfirm}
                onHide={() => setShowDeleteConfirm(false)}
                message="¿Estás seguro de que quieres eliminar este usuario?"
                header="Confirmar Eliminación"
                icon="pi pi-exclamation-triangle"
                accept={() => deleteUser()}
                reject={() => setShowDeleteConfirm(false)}
            />

            <div className='container'>
                <h1>Bienvenido a mi CRUD</h1>
                <h3>He usado react y nestjs</h3>

                <div className='users-list'>
                    <div className='addnewuser'>
                        <button className='btn btn-success' onClick={() => setShowAddModel(true)}>Agregar nuevo usuario<i className='pi pi-plus'></i></button>
                    </div>
                    <DataTable value={users} responsiveLayout="scroll">
                        <Column field="_id" header="Id"></Column>
                        <Column field="username" header="Name"></Column>
                        <Column field="age" header="Age"></Column>
                        <Column field="email" header="Email"></Column>
                        <Column header="Actions" body={actionsTemplate}></Column>
                    </DataTable>
                </div>
            </div>
            <Dialog visible={ShowSiewModel} style={{ width: '70vw' }} onHide={() => setShowSiewModel(false)} className='titulopopups'>
                <_viewUser UserPassword={selectedUserId} />
            </Dialog>
            <Dialog visible={ShowAddModel} style={{ width: '70vw' }} onHide={() => setShowAddModel(false)} className='titulopopups' header="Add New User">
                <_addUser onUserAdded={getAllUsers} />
            </Dialog>
            <Dialog visible={ShowEditModel} style={{ width: '70vw' }} onHide={() => setShowEditModel(false)} className='titulopopups' header="Edit User">
                <_editUser userId={selectedUserIdForEdit} onUserUpdated={getAllUsers} onHide={() => setShowEditModel(false)} />
            </Dialog>
        </div>
    );
}

export default Users;