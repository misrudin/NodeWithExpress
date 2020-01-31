const connection = require('../configs/db');

module.exports = {
    getProduct: () => {
        return new Promise((resolve, reject) => {
            connection.query("SELECT * FROM product_name", (err, result) => {
                if (!err) {
                    resolve(result);
                } else {
                    reject(new Error(err));
                }
            })
        })
    },


    productDetail: (id_product) => {
        return new Promise((resolve, reject) => {
            connection.query("SELECT product_name.*,category.nama_category FROM product_name INNER JOIN category ON product_name.id_category=category.id WHERE product_name.id = ?", id_product, (err, result) => {
                if (!err) {
                    resolve(result);
                } else {
                    reject(new Error(err));
                }
            })
        })
    },
    insertProduct: (data) => {
        return new Promise((resolve, reject) => {
            connection.query("INSERT INTO product_name SET ?", data, (err, result) => {
                if (!err) {
                    resolve(result);
                } else {
                    reject(new Error(err));
                }
            })
        })
    },
    updateProduct: (data, id_product) => {
        return new Promise((resolve, reject) => {
            connection.query("UPDATE product_name SET ? WHERE id = ?", [data, id_product], (err, result) => {
                if (!err) {
                    resolve(result);
                } else {
                    reject(new Error(err));
                }
            })
        })
    },
    deleteProduct: (id_product) => {
        return new Promise((resolve, reject) => {
            connection.query("DELETE FROM product_name WHERE id = ?", id_product, (err, result) => {
                if (!err) {
                    resolve(result);
                } else {
                    reject(new Error(err));
                }
            })
        })
    }
}