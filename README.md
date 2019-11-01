# Buildtemplate
Javascript class for parsing and generating Guild Wars 2 build templates

## Examples

Create a template:

```
var build = new Buildtemplate();
build.profession = 6;

build.specializations[0].id = 31;
build.specializations[0].traits = [1, 2, 2];

build.specializations[1].id = 37;
build.specializations[1].traits = [3, 2, 1];

build.specializations[2].id = 56;
build.specializations[2].traits = [3, 3, 3];

build.skills.terrestrial.heal = 116;
build.skills.terrestrial.utilities = [5621, 115, 5941];
build.skills.terrestrial.elite = 5906;

build.skills.aquatic.heal = 0;
build.skills.aquatic.utilities = [0, 0, 0];
build.skills.aquatic.elite = 0;

console.log(build.toString());
```

Parse template:

```
var build = new Buildtemplate("[&DQYfKSUbOD90AHQA9RUAAHMAAAA1FwAAEhcAAAAAAAAAAAAAAAAAAAAAAAA=]");
```

Modify template:

```
var build = new Buildtemplate();

build.parse("[&DQYfKSUbOD90AHQA9RUAAHMAAAA1FwAAEhcAAAAAAAAAAAAAAAAAAAAAAAA=]");
build.specializations[0].traits[0] = 3;
build.skills.terrestrial.utilities = [115, 5621, 5941];
build.skills.aquatic.heal = 116;

console.log(build.toString());
```

## Chat link specifications 

- [Guild Wars 2 Wiki](https://wiki.guildwars2.com/wiki/Chat_link_format#Build_templates_link)