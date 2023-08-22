use Object::Pad;

class Person;

use strict;
use warnings;

field $id :param :reader;
field $name :param :reader;
field $parent :param :reader = undef;
field $monarch :param :reader;
field $gender :param :reader;
field $birth :param :reader;
field $death :param :reader = undef;

method as_hashref {
  my $hashref;

  for (qw[id name parent monarch gender birth death]) {
    if ($_ eq 'parent') {
        $hashref->{parent} = $self->parent ? $self->parent->id : undef;
    } else {
        $hashref->{$_} = $self->$_;
    }
  }

  return $hashref;
}

1;
