'use strict'
const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';

const productSchema = new Schema({
    product_name: { type: String, require: true },
    product_thumb: { type: String, require: true },
    product_description: String,
    product_price: { type: Number, require: true },
    product_quantity: { type: Number, require: true },
    product_type: { type: String, require: true, enum: ['Electronics', 'Clothing', 'Furniture'] },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
    product_attributes: { type: Schema.Types.Mixed, require: true },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

const clothingSchema = new Schema({
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
    branch: { type: String, require: true },
    size: String,
    material: String
}, {
    timestamps: true,
    collection: 'clothes'
});

const electronicSchema = new Schema({
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
    manufacturer: { type: String, require: true },
    model: String,
    color: String
}, {
    timestamps: true,
    collection: 'electronics'
});

const furnitureSchema = new Schema({
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
    branch: { type: String, require: true },
    size: String,
    material: String
}, {
    timestamps: true,
    collection: 'furnitures'
});

module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    clothing: model('Clothing', clothingSchema),
    electronic: model('Electronics', electronicSchema),
    furniture: model('Furniture', furnitureSchema),
}