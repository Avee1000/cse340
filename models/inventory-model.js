const { check } = require("express-validator")
const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Insert into classification data
 * ************************** */
async function addClassification(classification_name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
    return await pool.query(sql, [classification_name])
  } catch (error) {
    console.error("addClassification error:", error.message)
    throw error
  }
}


/* **********************
 *   Check for existing classification_name
 * ********************* */
async function checkExistingClassification(classification_name){
  try {
    const sql = "SELECT * FROM classification WHERE classification_name = $1"
    const classification = await pool.query(sql, [classification_name])
    return classification.rowCount
  } catch (error) {
    return error.message
  }
}



// /* **********************
//  *   Check for classification_id of classification_name
//  * ********************* */
// async function getClassificationId(classification_name){
//   try {
//     const sql = "SELECT classification_id FROM classification WHERE classification_name = $1"
//     const classificationId = await pool.query(sql, [classification_name])
//     return classificationId.rows[0]
//   } catch (error) {
//     return error.message
//   }
// }


/* ***************************
 *  Insert into classification data
 * ************************** */
async function addInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) {
  try {
    const sql = `
      INSERT INTO inventory (
        inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail,
        inv_price, inv_miles, inv_color, classification_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    const values = [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id];
    return await pool.query(sql, values);
  } catch (error) {
    console.error("addInventory error:", error.message);
    throw error;
  }
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

async function getInventoryById(inv_id) {
  try {
    const res = await pool.query(
    "SELECT * FROM public.inventory WHERE inv_id = $1",
    [inv_id]
    )
    return res.rows
  } catch (error) {
    console.error("getinventorybyid error " + error)
  }
}

// async function testGetInventory() {
//   try {
//     const data = await getInventoryByClassificationId(1);
//     console.log(data);
//   } catch (err) {
//     console.error(err);
//   }
// }

// testGetInventory();

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryById,
  addClassification,
  checkExistingClassification,
  addInventory
};
