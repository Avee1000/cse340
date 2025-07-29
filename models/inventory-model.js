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
     const data = await pool.query(
      `INSERT INTO classification (classification_name)
      VALUES($1)`,
      [classification_name]
    )
    return data.rows[0]
  } catch (error) {
    console.error("addClassification" + error)
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
  checkExistingClassification
};
