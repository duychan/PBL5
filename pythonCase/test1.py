import sys
# Takes first name and last name via command 
# line arguments and then display them
z = list(map(int,sys.argv[1].split(",")))
print("Output from Python")
print("Array from js: " + str(z))
def suma(arr):
      x = 0
      for i in arr:
            x += i
      return x
print("data received" + str(z))
print("sumdata:"+str(suma(z)))
