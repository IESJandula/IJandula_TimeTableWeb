clase = input("Dime el nombre de la clase:\n")
atributos = []

salir = False

while not salir:
    attr = input("Dime el nombre de tu atributo (pulsa cualquier numero para terminar y crear la clase):\n")

    try:
        comprobarSalida = int(attr)
        salir = True
    except Exception:
        atributos.append(attr)

estructura = "export class "+clase+"{\n"
estructura += "\tconstructor("
for attr in atributos:
    estructura+=attr+","

estructura = estructura.removesuffix(",")

estructura+=")\n\t{\n"
for attr in atributos:
    estructura+="\t\tthis."+attr+" = "+attr+"\n"

estructura+="\t}\n}"

print(estructura)