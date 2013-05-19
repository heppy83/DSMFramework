var demoLanguage={
		
    languageName: "meltingpotDemo",
		
		
    //inputEx fields for pipes configuration-panel
    propertiesFields: [
    {
        "type": "string", 
        "name": "par1_propertie", 
        label: "Param1", 
        typeInvite: "Enter a value"
    },
    {
        "type": "string", 
        "name": "par2_propertie", 
        label: "Param2", 
        typeInvite: "Enter a value"
    },
    ],
		
    //description for component
    modules: [
	
    /**
      * Component with one operations
      *                    
     */

    {
        "name": "Name-Component-1",
        "category": "component",
        "container": {
            //witch container class to use 
            "xtype": "ComponentOperation",
            "title": "component1",
            "icon": "./plugins/editor/assets/application_edit.png",
            "fields": [
            {	
                "type":"group",
                "name":"g_op",
                "legend":"Operation-Name",
                "fields": [	     
                {
                    "type": "inputParameter",
                    "label":"in1_op", 
                    "name": "in1_op", 
                    "wirable":true,
                    "manualInput":false
                        
                },

                {
                    "type": "inputParameter", 
                    "label":"in2_op",
                    "name": "in2_op", 
                    "wirable":true,
                    "manualInput":true
                },
                    
                {
                    "type": "outputParameter",
                    "label":"out1_op", 
                    "name": "out1_op", 
                    "wirable":true
                },

                {
                    "type": "outputParameter", 
                    "label":"out2_op",
                    "name": "out2_op", 
                    "wirable":true
                },
                ]
                
            },
            {
                type:"configurationParameter",
                name:"configuration_parameter",
                legend:"Configuration - Parameter",
                collapsible: true,
                collapsed : true,
                fields:[
                {
                    type:"string",
                    name:"p1",
                    label:"Param1"
                },

                {
                    type:"string",
                    name:"p2",
                    label:"Param2"
                }
                ]
                
            }
            ],
            
            "terminals": [
            {
                "wireConfig":{
                    "xtype":"WireIt.BezierWire", 
                    "allowedTypes":["output"]
                },
                ddConfig: {
                    type: "input", 
                    allowedTypes: ["output"]
                },
                "direction": [0,-1], 
                "offsetPosition": {
                    "left": 170, 
                    "top": -15
                }, 
                "name": "in"
            },

            {
                "wireConfig":{
                    "xtype":"WireIt.BezierWire", 
                    "allowedTypes":["input"]
                },
                ddConfig: {
                    type: "output", 
                    allowedTypes: ["input"]
                },
                "direction": [0,1], 
                "offsetPosition": {
                    "left": 170, 
                    "bottom": -15
                }, 
                "name": "out"
            }

            ]

        
		       	
        }
    },
		      	
    /*
     *
     * Component with more operations 
     *                   
     */                                                            
                        
    {
        "name": "Name-Component-2",
        "category": "component",
        //properties of the container
        "container": {
            //witch container class to use 
            "xtype": "ComponentOperations",
            "title": "component2",
            "icon": "./plugins/editor/assets/application_edit.png",
            
            fields: [
            {
                type: 'select', 
                label: 'Operation',
                choices: [
                {
                    value: "Operation1"
                }, 

                {
                    value: "Operation2"
                }
                ],
                value:"Operation2",
                
                interactions: [
                {
                    valueTrigger: "Operation1",
                    actions: [
                    {
                        name: "operation1Select",
                        action: "show"
                    },

                    {
                        name: "operation2Select",
                        action: "hide"
                    },
                    ]
                },
                
                {
                    valueTrigger: "Operation2",
                    actions: [
                    {
                        name: "operation1Select",
                        action: "hide"
                    },

                    {
                        name: "operation2Select",
                        action: "show"
                    },
                    ]
                }
                ]
            },
            
            {
                type: 'group',  
                name: 'operation1Select', 
                fields:[
                {
                    "type": "inputParameter",
                    "label":"in1_op1", 
                    "name": "in1_op1", 
                    "wirable":true,
                    "manualInput":true
                        
                },

                {
                    "type": "inputParameter", 
                    "label":"in2_op1",
                    "name": "in2_op1", 
                    "wirable":true,
                    "manualInput":true
                },
                {
                    "type": "outputParameter",
                    "label":"out1_op1", 
                    "name": "out1_op1", 
                    "wirable":true
                        
                },

                {
                    "type": "outputParameter", 
                    "label":"out2_op1",
                    "name": "out2_op1", 
                    "wirable":true
                },
                
                {
                    type:"configurationParameter",
                    name:"configuration_parameter",
                    legend:"Configuration - Parameter",
                    collapsible: true,
                    collapsed : true,
                    fields:[
                    {
                        type:"string",
                        name:"p1",
                        label:"Param1"
                    },

                    {
                        type:"string",
                        name:"p2",
                        label:"Param2"
                    }
                    ]
                
                }
                
                ]
            },
            
            {
                type: 'group', 
                name: 'operation2Select', 
                fields:[
                {
                    "type": "inputParameter",
                    "label":"in1_op2", 
                    "name": "in1_op2", 
                    "wirable":true,
                    "manualInput":false
                        
                },

                {
                    "type": "inputParameter", 
                    "label":"in2_op2",
                    "name": "in2_op2", 
                    "wirable":true,
                    "manualInput":false
                },
                
                {
                    "type": "outputParameter",
                    "label":"out1_op2", 
                    "name": "out1_op2", 
                    "wirable":true
                        
                },

                {
                    "type": "outputParameter", 
                    "label":"out2_op2",
                    "name": "out2_op2", 
                    "wirable":true
                },
                
                {
                    type:"configurationParameter",
                    name:"configuration_parameter",
                    legend:"Configuration - Parameter",
                    collapsible: true,
                    collapsed : true,
                    fields:[
                    {
                        type:"string",
                        name:"p1",
                        label:"Param1"
                    },

                    {
                        type:"string",
                        name:"p2",
                        label:"Param2"
                    }
                    ]
                
                }
                
                ]
            }
            ],
            	      		
            "terminals": [
            {
                "wireConfig":{
                    "xtype":"WireIt.BezierWire", 
                    "allowedTypes":["output"]
                },
                ddConfig: {
                    type: "input", 
                    allowedTypes: ["output"]
                },
                "direction": [0,-1], 
                "offsetPosition": {
                    "left": 170, 
                    "top": -15
                }, 
                "name": "in"
            },

            {   
                "wireConfig":{
                    "xtype":"WireIt.BezierWire", 
                    "allowedTypes":["input"]
                },
                ddConfig: {
                    type: "output", 
                    allowedTypes: ["input"]
                },
                "direction": [0,1], 
                "offsetPosition": {
                    "left": 170, 
                    "bottom": -15
                }, 
                "name": "out"
            },  

            ]
        }
	
    },


    {
        "name": "Global-Variable",
        "category": "global-variable",
        "container": {
            //witch container class to use 
            "xtype": "GlobalVariable",
            "title": "Global Variable 1",
            "icon": "./plugins/editor/assets/application_edit.png",
            "image":"./assets/global_variable.jpg",
            "fields": [
            {
                type: 'group',  
                name: 'group', 
                fields:[
                {
                    "type": "string", 
                    "label": "", 
                    "name": ""
                },
//                {
//                    "type": "inputParameter",
//                    "label":"in", 
//                    "name": "in", 
//                    "wirable":true,
//                    "manualInput":false
//                        
//                },
//
//                {
//                    "type": "outputParameter",
//                    "label":"out", 
//                    "name": "out", 
//                    "wirable":true
//                        
//                },
                
                ]
            },
            ],
            "terminals": [
            {
                ddConfig: {
                    type: "inputparameter", 
                    allowedTypes: ["outputparameter"]
                },
                "direction": [0,-1], 
                "offsetPosition": {
                    "left": 115, 
                    "top": 60
                }, 
                "name": "in"
            },

            {   
                ddConfig: {
                    type: "outputparameter", 
                    allowedTypes: ["inputparameter"]
                },
                "direction": [0,1], 
                "offsetPosition": {
                    "right": 115, 
                    "top": 60
                }, 
                "name": "out"
            },  

            ]
        }
    },

    
    /*
     *
     *FormContainer
     *
     **/
    {
        "name": "FormContainer",
        "category": "component",
		 			
        //properties of the container
        "container": {
            //witch container class to use  
            "xtype": "WireIt.FormContainer",
            "title": "FormContainer",    
            "icon": "./plugins/editor/assets/application_edit.png",
            "collapsible": true,
            "fields": [ 
            {
                "type": "select", 
                "label": "Title", 
                "name": "title", 
                "selectValues": ["Mr","Mrs","Mme"]
            },
            {
                "type": "string", 
                "label": "Firstname", 
                "name": "firstname", 
                "required": true
            } , 
{
                "type": "string", 
                "label": "Lastname", 
                "name": "lastname", 
                "value":"Dupont"
            }, 

            {
                "type":"email", 
                "label": "Email", 
                "name": "email", 
                "required": true, 
                "wirable": true
            }, 
            {
                "type":"boolean", 
                "label": "Happy to be there ?", 
                "name": "happy"
            }, 
            {
                "type":"url", 
                "label": "Website", 
                "name":"website", 
                "size": 25
            }
            ],
            "legend": "Tell us about yourself...",
            "terminals":[]
        }
    },

		 	   
    /*
     *
     *Other form module
     *
     **/
    {
        "name": "Other form module",
        "category": "component",
        "container": {
            "icon": "./plugins/editor/assets/application_edit.png",
            "xtype": "WireIt.FormContainer",
            //List of inputEx field definitions
            "outputTerminals": [],
            "propertiesForm": [],
            "fields": [ 
            {
                "type": "select", 
                "label": "Title", 
                "name": "title", 
                "selectValues": ["Mr","Mrs","Mme"]
            },
            {
                "label": "Firstname", 
                "name": "firstname", 
                "required": true
            }, 
            {
                "label": "Lastname", 
                "name": "lastname", 
                "value":"Dupont"
            }, 

            {
                "type":"email", 
                "label": "Email", 
                "name": "email", 
                "required": true
            }, 

            {
                "type":"boolean", 
                "label": "Happy to be there ?", 
                "name": "happy"
            }, 

            {
                "type":"url", 
                "label": "Website", 
                "name":"website", 
                "size": 25
            } 
            ],
            "terminals":[]
        }
    },

		 		
    /*
     *
     *PostContainer
     *
     **/
    {
        "name": "PostContainer",
        "category": "component",
        //properties of the container	
        "container": {
            //witch container class to use
            "xtype":  "ComponentContainer",          //"WireIt.FormContainer",
            "title": "Post",    
            "icon": "./plugins/editor/assets/comments.png",

            //the options depends of the container class to used in xtype	
            "fields": [ 

            {
                "type": "inplaceedit", 
                "name": "post",
                "editorField":{
                    "type":"text"
                },  
                "animColors":{
                    "from":"#FFFF99" , 
                    "to":"#DDDDFF"
                }
            },

            {
                "type": "list",
                "label": "Comments", 
                "name": "comments", 
                "wirable": false,
                "elementType": {
                    "type":"string", 
                    "wirable": false
                }
            }

            ],

            "terminals": [
            {
                "name": "SOURCES", 
                "direction": [0,-1], 
                "offsetPosition": {
                    "left": 100, 
                    "top": -15
                }
            },

            {
                "name": "FOLLOWUPS", 
                "direction": [0,1], 
                "offsetPosition": {
                    "right": 100, 
                    "bottom": -15
                }
            }
            ]
        }
    },
	
        
    /*
      *
      *AND imagesContainer
      **/   
		     
    {
        "name": "AND gate",
        "category": "global-variable",
        //properties of the image	
        "container": {
            //witch container class  to use 	
            "xtype":"WireIt.ImageContainer", 
            "image": "./plugins/editor/examples/logicGates/images/gate_and.png",
            "icon": "./plugins/editor/assets/arrow_join.png",
            "terminals": [
            {
                "name": "_INPUT1", 
                "direction": [-1,0], 
                "offsetPosition": {
                    "left": -3, 
                    "top": 2
                }
            },

            {
                "name": "_INPUT2", 
                "direction": [-1,0], 
                "offsetPosition": {
                    "left": -3, 
                    "top": 37
                }
            }, 
            {
                "name": "_OUTPUT", 
                "direction": [1,0], 
                "offsetPosition": {
                    "left": 103, 
                    "top": 20
                }
            }
            ]
        }
    },


    /*
     *
     *Bubble ImageContainer
     */
    {
        "name": "Bubble",
        "category": "global-variable",
        "container": {
            "xtype":"WireIt.ImageContainer", 
            "className": "WireIt-Container WireIt-ImageContainer Bubble",
            "icon": "./plugins/editor/assets/color_wheel.png",
            "image": "./examples/bubble.png",
            "terminals": [
            {
                "direction": [-1,-1], 
                "offsetPosition": {
                    "left": -10, 
                    "top": -10
                }, 
                "name": "tl"
            },

            {
                "direction": [1,-1], 
                "offsetPosition": {
                    "left": 25, 
                    "top": -10
                }, 
                "name": "tr"
            },

            {
                "direction": [-1,1], 
                "offsetPosition": {
                    "left": -10, 
                    "top": 25
                }, 
                "name": "bl"
            },

            {
                "direction": [1,1], 
                "offsetPosition": {
                    "left": 25, 
                    "top": 25
                }, 
                "name": "br"
            }
            ]
        }
    },
			      
    {
        "name": "InOut test",
        "container": {
            "xtype":"WireIt.InOutContainer",
            "className": "WireIt-Container WireIt-InOutContainer Test",
            "icon": "./plugins/editor/assets/arrow_right.png",
            "inputs": ["text", "option1"],
            "outputs": ["option2","result"]
        }
    },

 

    /********************************************************************************/
    {
        "name": "Component",
        "category": "component",
        "container": {
            //witch container class to use 
            "xtype": "ComponentContainer",
            "title": "component-prova",
            "icon": "./plugins/editor/assets/application_edit.png",
            "image": "./assets/publications.png",
            "draggable":true,
            "fields": [
            {	
                "type":"group",
                "name":"g_op",
                "legend":"Operation-Name",
                "fields": [	     
                {
                    "type": "inputParameter",
                    "label":"in1_op", 
                    "name": "in1_op", 
                    "wirable":true,
                    "manualInput":false
                        
                },
                {
                    "type": "inputParameter", 
                    "label":"in2_op",
                    "name": "in2_op", 
                    "wirable":true,
                    "manualInput":true
                },
                    
                {
                    "type": "outputParameter",
                    "label":"out1_op", 
                    "name": "out1_op", 
                    "wirable":true
                },

                {
                    "type": "outputParameter", 
                    "label":"out2_op",
                    "name": "out2_op", 
                    "wirable":true
                },
                ]
                
            },
                
            {
                type:"configurationParameter",
                name:"configuration_parameter",
                legend:"Configuration - Parameter",
                collapsible: true,
                collapsed : true,
                fields:[
                {
                    type:"string",
                    name:"p1",
                    label:"Param1"
                },

                {
                    type:"string",
                    name:"p2",
                    label:"Param2"
                }
                ]
                
            }
            ],
            
            "terminals": [
            {
                "wireConfig":{
                    "xtype":"WireIt.BezierWire", 
                    "allowedTypes":["output"]
                },
                ddConfig: {
                    type: "input", 
                    allowedTypes: ["output"]
                },
                "direction": [0,-1], 
                "offsetPosition": {
                    "left": 115, 
                    "top": 60
                },  
                "name": "input"
            },

            {
                "wireConfig":{
                    "xtype":"WireIt.BezierWire", 
                    "allowedTypes":["input"]
                },
                ddConfig: {
                    type: "output", 
                    allowedTypes: ["input"]
                },
                "direction": [0,1], 
                "offsetPosition": {
                    "right": 115, 
                    "top": 60
                }, 
                "name": "output"
            }

            ]       	
        }
    },

    {
        "name": "Component2",
        "category": "component",
        //properties of the container
        "container": {
            //witch container class to use 
            "xtype": "ComponentContainer",
            "title": "component",
            "icon": "./plugins/editor/assets/application_edit.png",
            "image":"./assets/researchers.png",
            fields: [
            {
                type: 'select', 
                label: 'Operation',
                choices: [
                {
                    value: "Operation1"
                }, 

                {
                    value: "Operation2"
                }
                ],
                value:"Operation2",
                
                interactions: [
                {
                    valueTrigger: "Operation1",
                    actions: [
                    {
                        name: "operation1Select",
                        action: "show"
                    },

                    {
                        name: "operation2Select",
                        action: "hide"
                    },
                    ]
                },
                
                {
                    valueTrigger: "Operation2",
                    actions: [
                    {
                        name: "operation1Select",
                        action: "hide"
                    },

                    {
                        name: "operation2Select",
                        action: "show"
                    },
                    ]
                }
                ]
            },
            
            {
                type: 'group',  
                name: 'operation1Select', 
                fields:[
                {
                    "type": "inputParameter",
                    "label":"in1_op1", 
                    "name": "in1_op1", 
                    "wirable":true,
                    "manualInput":true
                        
                },

                {
                    "type": "inputParameter", 
                    "label":"in2_op1",
                    "name": "in2_op1", 
                    "wirable":true,
                    "manualInput":true
                },
                {
                    "type": "outputParameter",
                    "label":"out1_op1", 
                    "name": "out1_op1", 
                    "wirable":true
                        
                },

                {
                    "type": "outputParameter", 
                    "label":"out2_op1",
                    "name": "out2_op1", 
                    "wirable":true
                },
                
                {
                    type:"configurationParameter",
                    name:"configuration_parameter",
                    legend:"Configuration - Parameter",
                    collapsible: true,
                    collapsed : true,
                    fields:[
                    {
                        type:"string",
                        name:"p1",
                        label:"Param1"
                    },

                    {
                        type:"string",
                        name:"p2",
                        label:"Param2"
                    }
                    ]
                
                }
                
                ]
            },
            
            {
                type: 'group', 
                name: 'operation2Select', 
                fields:[
                {
                    "type": "inputParameter",
                    "label":"in1_op2", 
                    "name": "in1_op2", 
                    "wirable":true,
                    "manualInput":false
                        
                },

                {
                    "type": "inputParameter", 
                    "label":"in2_op2",
                    "name": "in2_op2", 
                    "wirable":true,
                    "manualInput":false
                },
                
                {
                    "type": "outputParameter",
                    "label":"out1_op2", 
                    "name": "out1_op2", 
                    "wirable":true
                        
                },

                {
                    "type": "outputParameter", 
                    "label":"out2_op2",
                    "name": "out2_op2", 
                    "wirable":true
                },
                
                {
                    type:"configurationParameter",
                    name:"configuration_parameter",
                    legend:"Configuration - Parameter",
                    collapsible: true,
                    collapsed : true,
                    fields:[
                    {
                        type:"string",
                        name:"p1",
                        label:"Param1"
                    },

                    {
                        type:"string",
                        name:"p2",
                        label:"Param2"
                    }
                    ]
                
                }
                
                ]
            }
            ],
            	      		
            "terminals": [
            {
                "wireConfig":{
                    "xtype":"WireIt.BezierWire", 
                    "allowedTypes":["output"]
                },
                ddConfig: {
                    type: "input", 
                    allowedTypes: ["output"]
                },
                "direction": [0,-1], 
                "offsetPosition": {
                    "left": 115, 
                    "top": 60
                }, 
                "name": "in"
            },

            {   
                
                "wireConfig":{
                    "xtype":"WireIt.BezierWire", 
                    "allowedTypes":["input"]
                },
                ddConfig: {
                    type: "output", 
                    allowedTypes: ["input"]
                },
                "direction": [0,1], 
                "offsetPosition": {
                    "right": 115, 
                    "top": 60
                }, 
                "name": "out"
            },  

            ]
        }
	
    },


    ]
};

