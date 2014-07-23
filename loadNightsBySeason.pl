#!C:/strawberry/perl/bin/perl.exe -w
use strict;
#use warnings;


use CGI ();
use CGI qw{ :standard };
use CGI::Carp qw{ fatalsToBrowser };
use JSON ();
use DBI;

print header('application/json');

#$dbh = DBI->connect('DBI:mysql:localhost:test', 'root', 'dallas'
#	           ) || die "Could not connect to database: $DBI::errstr";
# (insert query examples here...)
my $dbh = DBI->connect('DBI:mysql:test;host=localhost', 'root', 'dallas',
	            { RaiseError => 1 }
	           );
my $eff =<<END;
select n.date, p.name, n.p1point, n.p2point, n.p3point, n.p4point, n.p5point
from speldb.night n
inner join speldb.player p on p.playerid = n.playerid
where n.seasonid = 4
order by n.date;
END
#print "$eff";
my $sth = $dbh->prepare($eff
                         );

$sth->execute();
print "{ \"nights\" : [";
while (my @row = $sth->fetchrow_array()) {
            my ($date, $host, $p1point, $p2point, $p3point, $p4point, $p5point ) = @row;
            print "{\"date\" : \"$date\", \"host\" : \"$host\", \"p1point\" : $p1point, \"p2point\" : $p2point, \"p3point\" :$p3point, \"p4point\" : $p4point, \"p5point\" : $p5point },\n";
}
print "{}]}";


#my $result = $sth->fetchrow_hashref();
#print "{\"test\": \"$result->{value}\" }\n";
$sth->finish();

$dbh->disconnect();

