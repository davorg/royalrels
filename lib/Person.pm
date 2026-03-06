use Object::Pad;

class Person;

use strict;
use warnings;

field $id :param :reader;
field $name :param :reader;
field $parent :param :reader = undef;
field $parent2 :param :reader = undef;
field $monarch :param :reader;
field $gender :param :reader;
field $birth :param :reader;
field $death :param :reader = undef;

method parents {
  my @parents;
  push @parents, $parent  if $parent;
  push @parents, $parent2 if $parent2;
  return \@parents;
}

method as_hashref {
  my $hashref;

  for (qw[id name parent parent2 monarch gender birth death]) {
    if ($_ eq 'parent') {
        $hashref->{parent} = $self->parent ? $self->parent->id : undef;
    } elsif ($_ eq 'parent2') {
        $hashref->{parent2} = $self->parent2 ? $self->parent2->id : undef;
    } else {
        $hashref->{$_} = $self->$_;
    }
  }

  return $hashref;
}

1;
