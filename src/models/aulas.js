export class DimensionPlano{

    /**
     * Constructor que crea la dimension para el plano del aula
     * @param {number} height 
     * @param {number} width 
     * @param {number} top 
     * @param {number} right 
     * @param {number} left 
     * @param {string} planta 
     * @param {Aula} aula 
     */
    constructor(height,width,top,right,left,planta,aula)
    {
        this.height = height
        this.width = width
        this.top = top
        this.right = right
        this.left = left
        this.planta = planta
        this.aula = aula
    }
}

export class Aula{
    /**
     * Constructor que crea un aula
     * @param {string} numIntAu 
     * @param {string} abreviatura 
     * @param {string} nombre 
     */
    constructor(numIntAu,abreviatura,nombre)
    {
        this.numIntAu = numIntAu;
        this.abreviatura = abreviatura;
        this.nombre = nombre;
    }
}