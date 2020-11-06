import React, { useContext, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import { UserContext } from '../../components/Root';
import MainService from '../../services/MainService';
import moment from 'moment';
import { createUserDetailRoute } from './UserDetailPage';
import history from '../../config/history';

export const USER_LIST_OWNER_ROUTE = "/user/owners";

export default function OwnerUserListPage() {

    const { user, setUser } = useContext(UserContext);

    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

        MainService.getOwnerUsers(user)
            .then(response => {
                let { message, users } = response;
                users = users.map(restaurant => {
                    restaurant.created_at = moment(restaurant.created_at).format('D MMM Y');
                    return restaurant;
                })
                setUsers(users);
                setIsLoading(false);
            });
    }, []);

    return (
        <div className="RegularUserListPage">
            <DataTable
                pointerOnHover
                onRowClicked={v => { history.push(createUserDetailRoute(v.id)) }}
                title="Owner User List"
                columns={[
                    { name: 'Id', selector: 'id', sortable: true },
                    { name: 'Name', selector: 'name', sortable: true },
                    { name: 'Email', selector: 'email', sortable: true },
                    { name: 'Created At', selector: 'created_at', sortable: true },
                    {
                        cell: v => (
                            <div>
                                <span
                                    className="text-xs inline-block px-2 py-1 rounded bg-red-500 text-white m-1 cursor-pointer"
                                    onClick={() => {
                                        if (confirm("You sure about deleting?")) {
                                            MainService.deleteUser(v.id, user)
                                                .then(response => {
                                                    const r = [...users];
                                                    r.splice(r.findIndex(r => r.id === v.id), 1);
                                                    setUsers(r);
                                                    alert(response.message);
                                                })
                                        }
                                    }}>Delete</span>
                            </div>
                        ),
                        ignoreRowClick: true,
                        allowOverflow: true,
                        button: true,
                    }
                ]}
                data={users}
                progressPending={isLoading}
            />
        </div>
    )
}
