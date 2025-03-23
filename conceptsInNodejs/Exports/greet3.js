exports={"hi":"hi"}; 
/*This will not work, coz exports now points to a different object
 * and require returns module.exports which is still pointing to prev memory object, which is empty
 * in this case so output will be {}
 */
