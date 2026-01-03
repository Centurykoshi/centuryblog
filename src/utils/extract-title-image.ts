export function extractFirstHeading(contentJSON : any): string | null { 

    try { 

        const content = JSON.parse(contentJSON); 
//         {
//   type: "heading",
//   content: [
//     {
//       type: "text",
//       text: "Hello"
//     },
//     {
//       type: "text",
//       text: " World"
//     }
//   ]
// } it is stored like this that's why we are using array.isarray 



        function findFirstHeading(node : any) : string |null { 
            if(node.type === "Heading" && node.content && node.content.lenght >0){ 
                return node.content
                            .filter((item: any) => item.type === "text")
                            .map((item : any) => item.text)
                            .join(""); 
            }

            if(node.content && Array.isArray(node.content)){ 
                for(const child of node.content){ 
                    const heading = findFirstHeading(child); 
                    if(heading) return heading; 
                }
            }

            return null; 


        }
        return findFirstHeading(content); 
      
    }catch(error) { 
        console.error("Error extracting first heading : ", error); 
        return null; 
    }

}

export function Extractfirstimage(contentJSON : any): string | null { 
    try { 
        const content = JSON.parse(contentJSON); 

        function findfirstImage(node : any): string | null { 
            if(node.type === "image" && node.attrs && node.attrs.src){ 
                return node.attrs.src;
            }

            if(node.content && Array.isArray(node.content)){ 
                for(const child of node.content){ 
                    const image = findfirstImage(child); 
                    if(image) return image; 
                }
            }

            return null; 
        }

        return findfirstImage(content); 
    }catch(error){ 
        console.error("Error is there get better and fix it ", error); 
        return null; 
    }
}