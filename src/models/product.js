const connection = require('../configs/db');
const fs = require('fs');

module.exports = {
    getProduct: () => {
        return new Promise((resolve, reject) => {
            connection.query("SELECT * FROM product_name order by created_at desc", (err, result) => {
                if (!err) {
                    resolve(result);
                } else {
                    reject(new Error(err));
                }
            });
        });
    },


    productDetail: (id_product) => {
        return new Promise((resolve, reject) => {
            connection.query("SELECT product_name.*,category.nama_category FROM product_name INNER JOIN category ON product_name.id_category=category.id WHERE product_name.id = ?", id_product, (err, result) => {
                if (!err) {
                    resolve(result);
                } else {
                    reject(new Error(err));
                }
            });
        });
    },
    insertProduct: (data) => {
        return new Promise((resolve, reject) => {
            connection.query("INSERT INTO product_name SET ?", data, (err, result) => {
                if (!err) {
                    resolve(result);
                } else {
                    reject(new Error(err));
                }
            });
        });
    },
    updateProduct: (data, id_product) => {
        return new Promise((resolve, reject) => {
            const img = process.env.URL.replace('http://localhost:4001/', '');
            fs.unlink(img, (err) => {
                if (err) {
                    return;
                }
            });
            process.env.URL = "";
            connection.query("UPDATE product_name SET ? WHERE id = ?", [data, id_product], (err, result) => {
                if (!err) {
                    resolve(result);
                } else {
                    reject(new Error(err));
                }
            });
        });
    },
    deleteProduct: (id_product) => {
        return new Promise((resolve, reject) => {
            connection.query("SELECT image FROM product_name WHERE id=?", id_product, (err, result) => {
                const img = result[0].image.replace('http://localhost:4001/', '');
                fs.unlink(img, (err) => {
                    if (err) throw err;
                });
            });
            connection.query("DELETE FROM product_name WHERE id = ?", id_product, (err, result) => {
                if (!err) {
                    resolve(result);
                } else {
                    reject(new Error(err));
                }
            });
        });
    },

    fillterProduct: (keyword) => {
        return new Promise((resolve, reject) => {
            connection.query("SELECT product_name.*, category.nama_category FROM product_name INNER JOIN category ON product_name.id_category=category.id WHERE product_name.name LIKE ?", '%' + keyword + '%', (err, result) => {
                if (!err) {
                    resolve(result);
                } else {
                    reject(new Error(err));
                }
            });
        });
    },

    pagination: (nomor, total) => {

        const dataPage = 2;// jumlah data per halaman

        const totalPage = total / dataPage; // mengitung jumlah halaman

        const firstData = (dataPage * nomor) - dataPage; // menentukan awal data tiap halaman


        return new Promise((resolve, reject) => {
            connection.query("SELECT * FROM product_name ORDER BY name ASC LIMIT ?, ?", [firstData, dataPage], (err, result) => {
                if (!err) {
                    const page = Math.ceil(totalPage);
                    if (nomor > page) {
                        resolve(`Nothing Page ${nomor}`)
                    } else {
                        resolve([`Total Page : ${page}`, `Curren Page: ${nomor}`, result]);
                    }
                } else {
                    reject(new Error(err));
                }
            })
        })
    },

    sortByCategory: (name_category) => {
        return new Promise((resolve, reject) => {
            connection.query("SELECT category.nama_category, product_name.* FROM category INNER JOIN product_name ON category.id=product_name.id_category WHERE category.nama_category LIKE ?", '%' + name_category + '%', (err, result) => {
                if (!err) {
                    resolve(result);
                } else {
                    reject(new Error(err));
                }
            })
        })
    },
    sortUpdate: (date_update) => {
        return new Promise((resolve, reject) => {
            connection.query("SELECT category.nama_category, product_name.* FROM category INNER JOIN product_name ON category.id=product_name.id_category WHERE product_name.update_at LIKE ?", '%' + date_update + '%', (err, result) => {
                if (!err) {
                    resolve(result);
                } else {
                    reject(new Error(err));
                }
            });
        });
    },

    addToCart: (data) => {
        return new Promise((resolve, reject) => {

            connection.query("SELECT * FROM cart WHERE id_user=? AND id_product=?", [data.id_user, data.id_product], (err, result) => {
                if (!err) {
                    if (result.length > 0) {
                        connection.query("UPDATE cart SET qty=qty+? WHERE id_user=? AND id_product=?", [data.qty, data.id_user, data.id_product], (err, result) => {
                            if (!err) {
                                resolve(result);
                            } else {
                                reject(new Error(err));
                            }
                        });
                    } else {
                        connection.query("INSERT INTO cart SET ?", data, (err, result) => {
                            if (!err) {
                                resolve(result);
                            } else {
                                reject(new Error(err));
                            }
                        });
                    }
                }
            });
        });
    },

    addStok: (stokAdd, id_product) => {
        console.log(stokAdd);
        const date_update = new Date()
        return new Promise((resolve, reject) => {
            connection.query("UPDATE product_name SET stok = stok + ?,update_at=? WHERE id = ?", [stokAdd, date_update, id_product], (err, result) => {
                if (!err) {
                    resolve(result);
                } else {
                    reject(new Error(err));
                }
            });
        });
    }

}  // end code