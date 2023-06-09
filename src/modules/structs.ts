/*
* This file contains data models that are used to store data, this is needed by the storage module.
*/
export interface Contact {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
}