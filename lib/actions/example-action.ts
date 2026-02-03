"use server";
export  async function exampleAction() {
    await new Promise((resolve)=>setTimeout(resolve, 2000));
    return {
        success:true,
        message:"action completed",
        data:null
    };

}