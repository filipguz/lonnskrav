package sjogang.lonnskrav.regnskap.application;

import sjogang.lonnskrav.regnskap.domain.RegnskapSnapshot;

import java.util.Optional;

public interface RegnskapDataProvider {
    Optional<RegnskapSnapshot> fetchLatest(String orgNumber);
}