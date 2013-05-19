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
     *      Category Global Variables
     */
    
    {
        "name": "Global Variable",
        "category": "global-variable",
        "container": {
            //witch container class to use 
            "xtype": "GlobalVariable",
            "title": "Global Variable ",
            "icon": "./assets/global_variable.jpg",
            "image":"./assets/global_variable.jpg",
            "fields": [
                {
                    "type": "string", 
                    "label": "", 
                    "name": "",
                    "value":""
                },

            ],
            
            "terminals": [
            {
                ddConfig: {
                    type: "inputparameter", 
                    allowedTypes: ["outputparameter"]
                },
                direction: [0,-1],
                "offsetPosition": {
                    "right": 96, 
                    "top": 65
                }, 
                "name": "in"
            },

            {   
                ddConfig: {
                    type: "outputparameter", 
                    allowedTypes: ["inputparameter"]
                },
                direction: [0,1],
                "offsetPosition": {
                    "left": 96, 
                    "top": 65
                }, 
                "name": "out"
            },  

            ]
        }
    },


    /*
     **     Category Parallel Flows
     *
     */
    
    {
        "name": "Split",
        "category": "parallel-flows",
        "container": {
            //witch container class to use 
            "xtype": "Split",
            "title": "Split",
            "icon": "./assets/split.png",
            "image":"./assets/split.png", 
            "terminals": [
            {
                "wireConfig":{
                    "xtype":"WireIt.Wire", 
                    "allowedTypes":["output"]
                },
                nMaxWires: 1,
                ddConfig: {
                    type: "input", 
                    allowedTypes: ["output"]
                },
                "direction": [0,-1], 
                "offsetPosition": {
                    "left": -8, 
                    "top": 16
                }, 
                "name": "input"
            },

            {   
                
                "wireConfig":{
                    "xtype":"WireIt.Wire", 
                    "allowedTypes":["input"]
                },
                nMaxWires: 10,
                ddConfig: {
                    type: "output", 
                    allowedTypes: ["input"]
                },
                "direction": [0,1], 
                "offsetPosition": {
                    "right": -8, 
                    "top": 16
                }, 
                "name": "output"
            },  
  

            ]
        }
    },

    
    {
        "name": "Join",
        "category": "parallel-flows",
        "container": {
            //witch container class to use 
            "xtype": "Join",
            "title": "Join",
            "icon": "./assets/join.png",
            "image":"./assets/join.png", 
            "terminals": [
            {
                "wireConfig":{
                    "xtype":"WireIt.Wire", 
                    "allowedTypes":["output"]
                },
                nMaxWires: 10,
                ddConfig: {
                    type: "input", 
                    allowedTypes: ["output"]
                },
                "direction": [0,-1], 
                "offsetPosition": {
                    "left": -8, 
                    "top": 16
                }, 
                "name": "input"
            },

            {   
                
                "wireConfig":{
                    "xtype":"WireIt.Wire", 
                    "allowedTypes":["input"]
                },
                nMaxWires: 1,
                ddConfig: {
                    type: "output", 
                    allowedTypes: ["input"]
                },
                "direction": [0,1], 
                "offsetPosition": {
                    "right": -8, 
                    "top": 16
                }, 
                "name": "output"
            },  
  

            ]
        }
    },


    /*
     **      Category Components
     * 
     */
    
    {
        "name": "Component1",
        "category": "component",
        "container": {
            //witch container class to use 
            "xtype": "ComponentContainer",
            "title": "component",
            "icon": "./assets/publications.png",
            "image": "./assets/publications.png",
            "fields": [
            {	
                "type":"operation",
                "name":"op",
                "legend":"Operation-Name",
                "fields": [	     
                {
                    "type": "inputParameter",
                    "label":"in3", 
                    "name": "in3", 
                    "wirable":true,
                    "manualInput":false
                        
                },
                {
                    "type": "inputParameter", 
                    "label":"in4",
                    "name": "in4", 
                    "wirable":true,
                    "manualInput":true
                },
                    
                {
                    "type": "outputParameter",
                    "label":"out3", 
                    "name": "out3", 
                    "wirable":true
                },

                {
                    "type": "outputParameter", 
                    "label":"out4",
                    "name": "out4", 
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
                    "xtype":"WireIt.Wire", 
                    "allowedTypes":["output"]
                },
                ddConfig: {
                    type: "input", 
                    allowedTypes: ["output"]
                },
                "direction": [0,-1], 
                "offsetPosition": {
                    "left": 107, 
                    "top": 15
                },  
                "name": "input"
            },

            {
                "wireConfig":{
                    "xtype":"WireIt.Wire", 
                    "allowedTypes":["input"]
                },
                ddConfig: {
                    type: "output", 
                    allowedTypes: ["input"]
                },
                "direction": [0,1], 
                "offsetPosition": {
                    "right": 107, 
                    "top": 15
                }, 
                "name": "output"
            },
            
            {
                ddConfig: {
                    type: "inputparameter", 
                    allowedTypes: ["outputparameter"]
                },
                "direction": [-1,0],
                "offsetPosition": {
                    "left": 138, 
                    "top": 64
                }, 
                "name": "_externalInput"
            },
//            
//            {
//                ddConfig: {
//                    type: "inputparameter", 
//                    allowedTypes: ["outputparameter"]
//                },
//                "direction": [-1,0],
//                "offsetPosition": {
//                    "left": 116, 
//                    "top": 64
//                }, 
//                "name": "in2"
//            },
//            
            {   
                ddConfig: {
                    type: "outputparameter", 
                    allowedTypes: ["inputparameter"]
                },
                "direction": [1,0],
                "offsetPosition": {
                    "right": 138, 
                    "top": 64
                }, 
                "name": "_externalOutput"
            },
//
//            {   
//                ddConfig: {
//                    type: "outputparameter", 
//                    allowedTypes: ["inputparameter"]
//                },
//                "direction": [1,0],
//                "offsetPosition": {
//                    "right": 116, 
//                    "top": 64
//                }, 
//                "name": "out2"
//            },
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
            "icon": "./assets/researchers.png",
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
                type: 'operation',  
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
                type: 'operation', 
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
                    "xtype":"WireIt.Wire", 
                    "allowedTypes":["output"]
                },
                ddConfig: {
                    type: "input", 
                    allowedTypes: ["output"]
                },
                "direction": [0,-1], 
                "offsetPosition": {
                    "left": 107, 
                    "top": 15
                }, 
                "name": "in"
            },

            {   
                
                "wireConfig":{
                    "xtype":"WireIt.Wire", 
                    "allowedTypes":["input"]
                },
                ddConfig: {
                    type: "output", 
                    allowedTypes: ["input"]
                },
                "direction": [0,1], 
                "offsetPosition": {
                    "right": 107, 
                    "top": 15
                }, 
                "name": "out"
            },  

            ]
        }
	
    },
    
    {
        "name": "Component3",
        "category": "component",
        "container": {
            //witch container class to use 
            "xtype": "ComponentContainer",
            "title": "component",
            "icon": "./assets/publications.png",
            "image": "./assets/publications.png",
            "draggable":true,
            "fields": [
            {	
                "type":"operation",
                "name":"op3",
                "legend":"Operation-Name",
                "fields": [	     
                {
                    "type": "inputParameter",
                    "label":"in1", 
                    "name": "in1", 
                    "wirable":true,
                    "manualInput":false
                        
                },
                {
                    "type": "inputParameter", 
                    "label":"in2",
                    "name": "in2", 
                    "wirable":true,
                    "manualInput":true
                },
                    
                {
                    "type": "outputParameter",
                    "label":"out1", 
                    "name": "out1", 
                    "wirable":true
                },

                {
                    "type": "outputParameter", 
                    "label":"out2",
                    "name": "out2", 
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
                    "xtype":"WireIt.Wire", 
                    "allowedTypes":["output"]
                },
                ddConfig: {
                    type: "input", 
                    allowedTypes: ["output"]
                },
                "direction": [0,-1], 
                "offsetPosition": {
                    "left": 107, 
                    "top": 15
                },  
                "name": "input"
            },

            {
                "wireConfig":{
                    "xtype":"WireIt.Wire", 
                    "allowedTypes":["input"]
                },
                ddConfig: {
                    type: "output", 
                    allowedTypes: ["input"]
                },
                "direction": [0,1], 
                "offsetPosition": {
                    "right": 107, 
                    "top": 15
                }, 
                "name": "output"
            },
            
            {
                ddConfig: {
                    type: "inputparameter", 
                    allowedTypes: ["outputparameter"]
                },
                "direction": [-1,0],
                "offsetPosition": {
                    "left": 138, 
                    "top": 64
                }, 
                "name": "_externalInput"
            },
            
            {
                ddConfig: {
                    type: "outputparameter", 
                    allowedTypes: ["inputparameter"]
                },
                "direction": [-1,0],
                "offsetPosition": {
                    "right": 138, 
                    "top": 64
                }, 
                "name": "_externalOutput"
            },
           ]       	
        }
    },
    
    {
        "name": "Component4",
        "category": "component",
        "container": {
            //witch container class to use 
            "xtype": "ComponentContainer",
            "title": "component",
            "icon": "./assets/publications.png",
            "image": "./assets/publications.png",
            "draggable":true,
            "fields": [
            {	
                "type":"operation",
                "name":"op",
                "legend":"Operation-Name",
                "fields": [	     
                {
                    "type": "inputParameter",
                    "label":"in1", 
                    "name": "in1", 
                    "wirable":true,
                    "manualInput":false
                        
                },
                {
                    "type": "inputParameter", 
                    "label":"in2",
                    "name": "in2", 
                    "wirable":true,
                    "manualInput":true
                },
                    
                {
                    "type": "outputParameter",
                    "label":"out1", 
                    "name": "out1", 
                    "wirable":true
                },

                {
                    "type": "outputParameter", 
                    "label":"out2",
                    "name": "out2", 
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
                    "xtype":"WireIt.Wire", 
                    "allowedTypes":["output"]
                },
                ddConfig: {
                    type: "input", 
                    allowedTypes: ["output"]
                },
                "direction": [0,-1], 
                "offsetPosition": {
                    "left": 107, 
                    "top": 15
                },  
                "name": "input"
            },

            {
                "wireConfig":{
                    "xtype":"WireIt.Wire", 
                    "allowedTypes":["input"]
                },
                ddConfig: {
                    type: "output", 
                    allowedTypes: ["input"]
                },
                "direction": [0,1], 
                "offsetPosition": {
                    "right": 107, 
                    "top": 15
                }, 
                "name": "output"
            },
          ]       	
        }
    },
    
    {
        "name": "Component5",
        "category": "component",
        "container": {
            //witch container class to use 
            "xtype": "ComponentContainer",
            "title": "component",
            "icon": "./assets/publications.png",
            "image": "./assets/publications.png",
            "draggable":true,
            "fields": [
            {	
                "type":"operation",
                "name":"op",
                "legend":"Operation-Name",
                "fields": [	     
                {
                    "type": "inputParameter",
                    "label":"in7", 
                    "name": "in7", 
                    "wirable":true,
                    "manualInput":false
                        
                },
                {
                    "type": "inputParameter", 
                    "label":"in8",
                    "name": "in8", 
                    "wirable":true,
                    "manualInput":true
                },
                    
                {
                    "type": "outputParameter",
                    "label":"out7", 
                    "name": "out7", 
                    "wirable":true
                },

                {
                    "type": "outputParameter", 
                    "label":"out8",
                    "name": "out8", 
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
                    "xtype":"WireIt.Wire", 
                    "allowedTypes":["output"]
                },
                ddConfig: {
                    type: "input", 
                    allowedTypes: ["output"]
                },
                "direction": [0,-1], 
                "offsetPosition": {
                    "left": 107, 
                    "top": 15
                },  
                "name": "input2"
            },

            {
                "wireConfig":{
                    "xtype":"WireIt.Wire", 
                    "allowedTypes":["input"]
                },
                ddConfig: {
                    type: "output", 
                    allowedTypes: ["input"]
                },
                "direction": [0,1], 
                "offsetPosition": {
                    "right": 107, 
                    "top": 15
                }, 
                "name": "output2"
            },
          ]       	
        }
    },
]
};

